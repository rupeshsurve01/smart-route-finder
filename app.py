from flask import Flask, render_template, request, jsonify
import heapq
import random

app = Flask(__name__)


graph = {
    "Pune": {"Mumbai": 150, "Nashik": 90, "Satara": 110},
    "Mumbai": {"Pune": 150, "Nashik": 170},
    "Nashik": {"Pune": 90, "Aurangabad": 120, "Mumbai": 170},
    "Aurangabad": {"Nashik": 120},
    "Satara": {"Pune": 110}
}


coordinates = {
    "Pune": [18.5204, 73.8567],
    "Mumbai": [19.0760, 72.8777],
    "Nashik": [19.9975, 73.7898],
    "Aurangabad": [19.8762, 75.3433],
    "Satara": [17.6805, 74.0183]
}

fuel_price = 100
car_mileage = 15


def dijkstra(start, end):

    queue = [(0, start, [])]
    visited = set()

    while queue:

        cost, node, path = heapq.heappop(queue)

        if node in visited:
            continue

        path = path + [node]
        visited.add(node)

        if node == end:
            return path, cost

        for neighbor, weight in graph[node].items():
            heapq.heappush(queue, (cost + weight, neighbor, path))

    return None


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/route", methods=["POST"])
def route():

    data = request.json

    start = data["start"]
    end = data["end"]
    mode = data["mode"]

    speeds = {
        "car": 60,
        "bike": 40,
        "walk": 5
    }

    result = dijkstra(start, end)

    if not result:
        return jsonify({"error": "No route found"})

    path, distance = result

    speed = speeds[mode]
    time = round(distance / speed, 2)

    traffic = random.choice(["Low", "Medium", "High"])

    if traffic == "Medium":
        time *= 1.2
    elif traffic == "High":
        time *= 1.5

    fuel_used = distance / car_mileage
    fuel_cost = round(fuel_used * fuel_price, 2)

    route_coords = [coordinates[city] for city in path]

    return jsonify({
        "path": path,
        "distance": distance,
        "time": round(time,2),
        "traffic": traffic,
        "fuel": fuel_cost,
        "coords": route_coords
    })


if __name__ == "__main__":
    app.run(debug=True)