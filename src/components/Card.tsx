import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Card({
  title,
  id,
  bookIMG,
}: {
  title: string;
  bookIMG: string;
  id: string;
}) {


  return (
    <div
      tabIndex={0}
      className="card"
    >
      <Link to={`/bookPage/${id}`}><img src={bookIMG} className='cursor-pointer'/></Link>
    </div>
  );
}
export default Card;