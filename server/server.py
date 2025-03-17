from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from typing import Dict, List, Tuple

app = Flask(__name__)
CORS(app)


class BinomialOptionPricer:
    @staticmethod
    def validate_parameters(data: Dict) -> Tuple[float, float, float, float, float, float, int, int]:
        """
        Validate and extract parameters from the input data.
        Raises ValueError if any parameter is invalid.
        """
        try:
            # Extract parameters
            volatility = float(data["volatility"])
            maturity_time = float(data["maturityTime"])
            interest_rate = float(data["riskFreeInterestRate"])
            stock_price = float(data["stockPrice"])
            strike_price = float(data["strikePrice"])
            evaluation_period = int(data["evaluationPeriod"])
            step = int(data["step"])
            volatility_step = float(data["volatilityStep"])

            # Validate non-negative parameters
            if any(val < 0 for val in [volatility, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, step, volatility_step]):
                raise ValueError("All parameters must be non-negative.")

            return volatility, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, step, volatility_step

        except KeyError as e:
            raise ValueError(f"Missing required parameter: {e}")
        except (ValueError, TypeError) as e:
            raise ValueError(f"Invalid parameter value: {e}")

    @staticmethod
    def calculate_time_interval(evaluation_period: int, maturity_time: float) -> float:
        """Calculate the time interval for each step in the binomial tree."""
        return round(maturity_time / evaluation_period, 3)
    
    @staticmethod
    def calculate_growth_factor(volatility: float, time_interval: float) -> float:
        """Calculate the growth factor or the appreciation factor, u."""
        return round(np.exp(volatility * np.sqrt(time_interval)), 3)
    
    @staticmethod
    def calculate_decay_factor(volatility: float, time_interval: float) -> float:
        """Calculate the decay factor or the appreciation factor, d."""
        return round(np.exp(-volatility * np.sqrt(time_interval)), 3)

    @staticmethod
    def calculate_risk_neutral_probability(time_interval: float, up_factor: float, down_factor: float, interest_rate: float) -> float:
        """
        Calculate the risk-neutral probability (q).
        Raises ValueError if q is not between 0 and 1.
        """
        q = (np.exp(interest_rate * time_interval) - down_factor) / (up_factor - down_factor)
        if not (0 < q < 1):
            raise ValueError("Risk-neutral probability (q) must be between 0 and 1.")
        return round(q, 3)

    @staticmethod
    def calculate_discounted_rate(interest_rate: float, time_interval: float) -> float:
        """Calculate the discounted rate."""
        return round(np.exp(-(interest_rate * time_interval)), 3)

    @staticmethod
    def calculate_option_premium(
        stock_price: float,
        strike_price: float,
        risk_neutral_probability: float,
        discounted_rate: float,
        up_factor: float,
        down_factor: float,
        evaluation_period: int,
    ) -> Dict[str, float]:
        """
        Calculate the option premium for both call and put options.
        """
        # Compute final stock prices
        stock_prices = stock_price * (down_factor ** (np.arange(evaluation_period, -1, -1))) * (up_factor ** (np.arange(0, evaluation_period + 1, 1)))
        call_prices = np.maximum(stock_prices - strike_price, np.zeros(evaluation_period + 1))
        put_prices = np.maximum(strike_price - stock_prices, np.zeros(evaluation_period + 1))

        # Traverse back to calculate option prices
        for i in np.arange(evaluation_period, 0, -1):
            call_prices = discounted_rate * ((risk_neutral_probability * call_prices[1:i + 1]) + ((1 - risk_neutral_probability) * call_prices[0:i]))
            put_prices = discounted_rate * ((risk_neutral_probability * put_prices[1:i + 1]) + ((1 - risk_neutral_probability) * put_prices[0:i]))

        return {
            "call": round(call_prices[0], 3),
            "strike_price": strike_price,
            "put": round(put_prices[0], 3),
        }


@app.route("/home")
def home():
    """Home route for testing."""
    return {"message": "Hello there, let's do some option pricing!"}


@app.route("/api/volatility/BOPM/OP", methods=["POST"])
def bopm_op():
    """Calculate option premium using the Binomial Option Pricing Model."""
    try:
        data = request.json
        # Validate and extract parameters
        volatility, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, _, _ = BinomialOptionPricer.validate_parameters(data)

        # Calculate intermediate values
        time_interval = BinomialOptionPricer.calculate_time_interval(evaluation_period, maturity_time)
        up_factor = BinomialOptionPricer.calculate_growth_factor(volatility, time_interval)
        down_factor = BinomialOptionPricer.calculate_decay_factor(volatility, time_interval)
        risk_neutral_probability = BinomialOptionPricer.calculate_risk_neutral_probability(time_interval, up_factor, down_factor, interest_rate)
        discounted_rate = BinomialOptionPricer.calculate_discounted_rate(interest_rate, time_interval)
        # Calculate option premium
        premium = BinomialOptionPricer.calculate_option_premium(
            stock_price, strike_price, risk_neutral_probability, discounted_rate, up_factor, down_factor, evaluation_period
        )
        return jsonify(premium)

    except ValueError as e:
        return jsonify({"error": "InvalidInput", "message": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "InternalServerError", "message": str(e)}), 500


@app.route("/api/volatility/BOPM/OP/extended", methods=["POST"])
def bopm_op_extended():
    """Calculate extended option premiums for a range of strike prices."""
    try:
        data = request.json
        # Validate and extract parameters
        volatility, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, step, _ = BinomialOptionPricer.validate_parameters(data)

        # Calculate intermediate values
        time_interval = BinomialOptionPricer.calculate_time_interval(evaluation_period, maturity_time)
        up_factor = BinomialOptionPricer.calculate_growth_factor(volatility, time_interval)
        down_factor = BinomialOptionPricer.calculate_decay_factor(volatility, time_interval)
        risk_neutral_probability = BinomialOptionPricer.calculate_risk_neutral_probability(time_interval, up_factor, down_factor, interest_rate)
        discounted_rate = BinomialOptionPricer.calculate_discounted_rate(interest_rate, time_interval)

        # Calculate premiums for a range of strike prices
        extended_premiums = []
        for i in range(-10, 11):
            adjusted_strike_price = strike_price + i * step
            if adjusted_strike_price < 0:
                continue  # Skip negative strike prices
            premium = BinomialOptionPricer.calculate_option_premium(
                stock_price, adjusted_strike_price, risk_neutral_probability, discounted_rate, up_factor, down_factor, evaluation_period
            )
            extended_premiums.append(premium)

        return jsonify(extended_premiums)

    except ValueError as e:
        return jsonify({"error": "InvalidInput", "message": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "InternalServerError", "message": str(e)}), 500


@app.route("/api/volatility/BOPM/VPH", methods=["POST"])
def bopm_vph():
    """Calculate Price fluctuations against volatility."""
    try:
        data = request.json
        # Validate and extract parameters
        volatility, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, step, volatility_step = BinomialOptionPricer.validate_parameters(data)

        time_interval = BinomialOptionPricer.calculate_time_interval(evaluation_period, maturity_time)
        discounted_rate = BinomialOptionPricer.calculate_discounted_rate(interest_rate, time_interval)

        heatmap = {}
        for i in range(0, 10):
            adjusted_volatility = round(volatility + i * volatility_step, 3)
            # Calculate intermediate values
            up_factor = BinomialOptionPricer.calculate_growth_factor(adjusted_volatility, time_interval)
            down_factor = BinomialOptionPricer.calculate_decay_factor(adjusted_volatility, time_interval)
            risk_neutral_probability = BinomialOptionPricer.calculate_risk_neutral_probability(time_interval, up_factor, down_factor, interest_rate)
        

            # Calculate premiums for a range of strike prices
            extended_premiums = []
            for i in range(-10, 11):
                adjusted_strike_price = strike_price + i * step
                if adjusted_strike_price < 0:
                    continue  # Skip negative strike prices
                premium = BinomialOptionPricer.calculate_option_premium(
                    stock_price, adjusted_strike_price, risk_neutral_probability, discounted_rate, up_factor, down_factor, evaluation_period
                )
                extended_premiums.append(premium)

            heatmap[adjusted_volatility] = extended_premiums
        
        return jsonify(heatmap)

    except ValueError as e:
        return jsonify({"error": "InvalidInput", "message": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "InternalServerError", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)