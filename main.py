from flask import Flask

app = Flask(__name__)
cart = {}

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    item = request.get_json().get('item')

    if item in cart:
        cart[item] += 1
    else:
        cart[item] = 1

    return jsonify({'message' : 'Item added to cart successfully'})


if __name__ == '__main__':
    app.run()