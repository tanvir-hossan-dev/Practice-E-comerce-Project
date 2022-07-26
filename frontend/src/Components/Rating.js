import React from "react";
import { Badge } from "react-bootstrap";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const Rating = ({ rating, numberofrating }) => {
  return (
    <>
      <div>
        <i>{rating >= 1 ? <BsStarFill /> : rating >= 0.5 ? <BsStarHalf /> : <BsStar />}</i>
        <i>{rating >= 2 ? <BsStarFill /> : rating >= 1.5 ? <BsStarHalf /> : <BsStar />}</i>
        <i>{rating >= 3 ? <BsStarFill /> : rating >= 2.5 ? <BsStarHalf /> : <BsStar />}</i>
        <i>{rating >= 4 ? <BsStarFill /> : rating >= 3.5 ? <BsStarHalf /> : <BsStar />}</i>
        <i>{rating >= 5 ? <BsStarFill /> : rating >= 4.5 ? <BsStarHalf /> : <BsStar />}</i>
      </div>
      <h6>
        Total <Badge bg="secondary">{numberofrating}</Badge> Rating
      </h6>
    </>
  );
};

export default Rating;
