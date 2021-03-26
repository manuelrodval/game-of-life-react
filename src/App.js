import {useCallback, useState, useRef} from "react"
import './App.css';
import produce from "immer"

const numRows = 40
const numColumns = 50

const App = () => {

  const [grid, setGrid] = useState([...Array(numRows)].map(e=>Array(numColumns).fill(false)))
  const [running, setRunning] = useState(false)
  const runRef = useRef()
  runRef.current = running

  const start = useCallback(()=>{
    if (!runRef.current) {
      return;
    }
    const evaluateLife = (subGrid, alive) => {
      let sum = 0 - alive
      subGrid.forEach(element => {
        element.forEach( el2=>{
          sum += el2
        })
      });
      let survives = (()=>{
        if (alive && sum >= 2 && sum <= 3) {return true}
        else if (!alive && sum === 3) {return true}
        else {return false}
      })()
      return survives
    }
    // Game 
    setGrid(prev=>{
      return produce(prev, gridCopy=>{
        for (let i = 0; i<numRows ; i++) {
          for (let k = 0 ; k < numColumns; k++) {
            let rowSlice = [i === 0? i:i-1,i===numRows?i+1:i+2]
            let colSlice = [k === 0? k:k-1,k===numColumns?k+1:k+2]
            let subGrid = prev.slice(rowSlice[0],rowSlice[1]).map(item=>item.slice(colSlice[0], colSlice[1]))
            let result = evaluateLife(subGrid, prev[i][k])
            gridCopy[i].splice(k,1,result)            
          }
        }
      })
    })
    setTimeout(start, 10)
  }, [])

  return (
    <div className="all">
      <div className="center">
        <div className="buttons">
          <button onClick={()=>{
            setRunning(prev=>!prev)
            if (!running) {
              runRef.current = true;
              start();
            }
          }}>{running?"Pause":"Start"}</button>
          <button onClick={()=>setGrid(()=>[...Array(numRows)].map(e=>Array(numColumns).fill(false)))} disabled={running?true:false}>Clear</button>
        </div>
      </div>
      <div className="center" style={{display:'grid', gridTemplateColumns:`repeat(${numColumns}, 25px)`}}>
        {grid.map(
          (row, rid)=>row.map(
            (col, cid)=>
            <div 
              key={`[${rid}, ${cid}]`}
              style={{height:20, width:20, borderStyle:'solid', color:'gray', backgroundColor:grid[rid][cid]?'green':'black'}}
              onClick={()=>{
                const newGrid = produce(grid, gridCopy=>{
                  gridCopy[rid][cid] = !grid[rid][cid];
                });
                setGrid(()=>newGrid)
              }}
              >
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
