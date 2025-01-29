import React from "react";
export default function AllServices({services}){
    const servicesString = services.map(service => service.name + ' ') ;    
    return <h1>testtest :{servicesString}</h1>
}