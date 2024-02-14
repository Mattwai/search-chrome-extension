import React from "react";
import "./SearchResult.css"

type Props = {
    result: any
}

const SearchResult = ({result}: Props) => {
    return <div className="search-result" 
    onClick={(e) => alert(`You clicked on ${result.name}`)}>
        {result.name}</div>
}

export default SearchResult;