import Stop from "../models/stop.model"
import Dijsktra from "../algorithms/dijkstra"
import StopTime from "../models/stop-time.model"
export default async function getRoute (req, res) {
  try {
    const { start, stop } = req.query
    // TODO find the shortest path between `start` and `stop`
    const startStop = Stop.getStops(start)[0] // for now I just take one of the Starts and Stops
    const stopStop = Stop.getStops(stop)[0]

    const startNode = Node(start, startStop) // create the startNode
    // 
    startNode.discover = () => {
      const stopList = await StopTime.getStopsLinked(startStop.id) // get all stops next to the current stop
      stopList.forEach(stop_ => {
        const node = Node(Stop.getStop(stop_.stop_id).stop_code, Stop.getStop(stop_.stop_id), this.discover()) // create a new Node.
        this.addNonOrientedPath(node, stop_.cost) // add a new path for each stop next to it.
      });
    }

    const stopNode = Node(stop, stopStop)
    const shortestPath = await Dijsktra.shortestPathFirst(startNode, stopNode) // get shortestPath

    res.json({ path: shortestPath })
  } catch (err) {
    res.status(500)
    res.json({
      message: 'La station n\'existe pas'
    })
  }
}
