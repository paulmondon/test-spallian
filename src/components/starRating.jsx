import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

function StarRating({ rating }) {
    const maxRating = 10;
    const numStars = 10;
    const filledStars = Math.round((rating / maxRating) * numStars);

    return (
        <div className="star-rating">
            {Array.from({ length: numStars }).map((_, index) => (
                <FontAwesomeIcon
                    key={index}
                    icon={index < filledStars ? filledStar : emptyStar}
                    className={`star ${index < filledStars ? 'filled' : 'empty'}`}
                />
            ))}
        </div>
    );
}

export default StarRating;