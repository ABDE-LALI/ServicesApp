import React from "react";
export default function AllCategories({ categories }) {
    const categoriesString = categories.map(categorie => categorie.name + ' ');
    return <h1>testtest :{categoriesString}</h1>
}