import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';

import { AnalyticsWidgetSummary } from '../../sections/overview/analytics-widget-summary';

const FlippableCard = ({colour ,title,img}) => {
  const [isFlipped, setIsFlipped] = useState(false); // State to track flip status

  const handleFlip = () => {
    setIsFlipped(!isFlipped); // Toggle flip state
  };

  return (
    <Box
      onClick={handleFlip} // Flip card on click
      sx={{
        perspective: '1000px', // 3D perspective
        width: '270px', // Card width
        height: '270px', // Card height
        cursor: 'pointer', // Pointer cursor
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d', // Preserve 3D effect
          transition: 'transform 0.6s', // Smooth flip transition
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', // Rotate based on state
        }}
      >
        {/* Front Side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden', // Hide back when facing front
          }}
        >
          <AnalyticsWidgetSummary
          color={colour}
            icon={
              <img
                alt='icon'
                src={img}
                style={{ height: '50px', width: '50px' }}
              />
            }
            chart={{
              categories: [],
            }}
            title={
              <Typography
                variant='h6'
                align='center'
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mt: 2,
                }}
              >
              {title}
              </Typography>
            }
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 3,
              padding: 2,
              backgroundColor: 'white', // Front side background
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Back Side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)', // Flip back side
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 3,
            padding: 2,
            backgroundColor: 'lightblue', // Back side background
            borderRadius: 2,
          }}
        >
          <Typography
            variant='h6'
            align='center'
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            Details about {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FlippableCard;
