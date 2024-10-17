import React from "react";


function HelloWorld(props) {
    return (
        <div className="m-auto align-middle flex p-8">
            Hello, {props.name}!
        </div>
    );
}

export default HelloWorld;