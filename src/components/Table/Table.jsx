import React from 'react'

function Table(props) {
  return (
    <div>
        <table className="table">
            <thead>
                <tr>
                    <th>{props.headers.map()}</th>
                </tr>
            </thead>
        </table>
    </div>
  )
}

export default Table
