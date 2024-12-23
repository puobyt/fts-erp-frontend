import React, { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { AnalyticsWidgetSummary } from '../../sections/overview/analytics-widget-summary'

const FlippableCard = ({ colour, title, img, links }) => {
  const [isFlipped, setIsFlipped] = useState(false) // State to track flip status

  const handleFlip = () => {
    setIsFlipped(!isFlipped) // Toggle flip state
  }

  return (
    <Box
      onClick={handleFlip} // Flip card on click
      sx={{
        perspective: '1000px', // 3D perspective
        width: '270px', // Card width
        height: '270px', // Card height
        cursor: 'pointer' // Pointer cursor
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d', // Preserve 3D effect
          transition: 'transform 0.6s', // Smooth flip transition
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' // Rotate based on state
        }}
      >
        {/* Front Side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden' // Hide back when facing front
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
              categories: []
            }}
            title={
              <Typography
                variant='h6'
                align='center'
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mt: 2
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
              borderRadius: 2
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
            borderRadius: 2
          }}
        >
          <Box>
            {/* Title */}
            <Typography
              variant='h6'
              align='center'
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2
              }}
            >
              Details about {title}
            </Typography>

            {/* Render Dynamic Links */}
            <Box
              sx={{
                maxHeight: '200px', // Set a maximum height for the container
                overflowY: 'auto', // Enable vertical scrolling
                overflowX: 'hidden', // Prevent horizontal scrolling
                padding: '8px', // Add padding inside the scrollable box
                borderRadius: '8px', // Rounded corners for the box
                border: '1px solid #ddd', // Optional border
                boxShadow: 1, // Light shadow effect
                '&::-webkit-scrollbar': {
                  display: 'none' // Hide the scrollbar
                }
              }}
            >
              {links?.map((link, index) => (
                <Link
                  key={index}
                  to={link.route} // Use 'to' for React Router
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgb(204, 220, 227)', // Orangish background
                    color: '#000',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    textDecoration: 'none', // Remove underline

                    '&:hover': {
                      backgroundColor: '#000',
                      color: '#000',
                      boxShadow: 3,
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FlippableCard
