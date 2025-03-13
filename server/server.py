from flask import Flask, request
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

def get_parameters(data):
    up_factor = float(data["upFactor"])
    down_factor = float(data["downFactor"])
    maturity_time = float(data["maturityTime"])
    interest_rate = float(data["riskFreeInterestRate"])
    stock_price = float(data["stockPrice"])
    strike_price = float(data["strikePrice"])
    evaluation_period = int(data["evaluationPeriod"])
    step = int(data["step"])

    return up_factor, down_factor, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, step

def get_time_interval(evaluation_period, maturity_time):# returns 't'
    return round(maturity_time / evaluation_period, 3)

def get_risk_neutral_probability(time_interval, up_factor, down_factor, interest_rate): # returns 'q'
    return round(((np.exp(interest_rate * time_interval) - down_factor) / (up_factor - down_factor)), 3)

def get_discounted_rate(interest_rate, time_interval): # returns 'disc'
    return round(np.exp(- (interest_rate * time_interval)), 3)

def get_volatility_factor(up_factor, down_factor): # returns 'v'
    return round(up_factor / down_factor, 3)


def get_option_premium(stock_price, strike_price, risk_neutral_probability, discounted_rate, up_factor, down_factor, evaluation_period):
    # Computing final price for stock using numpy array (vectors)
    STOCK_PRICES = stock_price * (down_factor ** (np.arange(evaluation_period, -1, -1))) * (up_factor ** (np.arange(0, evaluation_period+1, 1)))
    print(STOCK_PRICES)
    CALL_PRICES = np.maximum(STOCK_PRICES - strike_price, np.zeros(evaluation_period + 1))
    PUT_PRICES = np.maximum(strike_price - STOCK_PRICES, np.zeros(evaluation_period + 1))

    # Now we have possible final prices for call and put option we can traverse back
    for i in np.arange(evaluation_period, 0, -1):
        CALL_PRICES = discounted_rate * ((risk_neutral_probability * CALL_PRICES[1:i+1]) + ((1 - risk_neutral_probability) * CALL_PRICES[0:i]))
        print(CALL_PRICES)
        PUT_PRICES = discounted_rate * ((risk_neutral_probability * PUT_PRICES[1:i+1]) + ((1 - risk_neutral_probability) * PUT_PRICES[0:i]))

    return {
        "call": round(CALL_PRICES[0],3),
        "strike_price": strike_price,
        "put": round(PUT_PRICES[0],3)
    }

# Members API Route
@app.route("/home")
def home():
    return {"message": "Hello there lets do some pricing for options"}


@app.route('/api/volatility/BOPM/OP', methods=['POST'])
def bopm_op():
    data = request.json
    up_factor, down_factor, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, _ = get_parameters(data)
    time_interval = get_time_interval(evaluation_period, maturity_time) # t
    risk_neutral_probability = get_risk_neutral_probability(time_interval, up_factor, down_factor, interest_rate) # q
    discounted_rate = get_discounted_rate(interest_rate, time_interval) # disc
    # volatility_factor = get_volatility_factor(up_factor, down_factor) # v

    premium = get_option_premium(
        stock_price,
        strike_price,
        risk_neutral_probability,
        discounted_rate,
        up_factor,
        down_factor,
        evaluation_period
    )
    print(premium)
    return premium
    

@app.route('/api/volatility/BOPM/OP/extended', methods=['POST'])
def bopm_op_extended():
    data = request.json
    up_factor, down_factor, maturity_time, interest_rate, stock_price, strike_price, evaluation_period, step = get_parameters(data)
    time_interval = get_time_interval(evaluation_period, maturity_time) # t
    risk_neutral_probability = get_risk_neutral_probability(time_interval, up_factor, down_factor, interest_rate) # q
    discounted_rate = get_discounted_rate(interest_rate, time_interval) # disc

    extended_premiums = []

    for i in range(1, 10):
        if(strike_price - i*step < 0): 
            break
        premium = get_option_premium(
            stock_price,
            strike_price - i*step,
            risk_neutral_probability,
            discounted_rate,
            up_factor,
            down_factor,
            evaluation_period
        )
        extended_premiums.append(premium)

    extended_premiums.reverse()

    for i in range(0, 10):
        premium = get_option_premium(
            stock_price,
            strike_price + i*step,
            risk_neutral_probability,
            discounted_rate,
            up_factor,
            down_factor,
            evaluation_period
        )
        extended_premiums.append(premium)

    return extended_premiums

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000)
