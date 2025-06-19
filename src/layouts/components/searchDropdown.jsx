import React, { useState } from 'react'
import axiosInstance from '../../configs/axiosInstance'
import { Box, TextField, MenuItem, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import toast, { Toaster } from 'react-hot-toast'

const SearchBoxWithDropdown = ({ onSearchMaterials }) => {
  const [searchValue, setSearchValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')

  const handleSearch = async () => {
    if (dropdownValue === 'materials' && searchValue) {
      // toast.success('Searching materials...')

      try {
        const response = await axiosInstance.get(
          `/search/materials?code=${searchValue}`
        )

        const materials = response?.data?.materials
        if (materials && materials.length > 0) {
            toast.success(response.data.message)
          const results = response.data
          console.log("RESULT",results)
          if(results.qcDetails)
          {
            onSearchMaterials({materials:results.materials,qcDetails:results.qcDetails})
          }
          else{
            onSearchMaterials({materials:results.materials})
          }
        } else {
          toast.error('No materials found for the given code.')
        
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch material details.'
        toast.error(errorMessage)
        console.error(
          'Error fetching material details for traceability search:',
          err.message
        )
       
      }
    } else if(dropdownValue === 'finishedGoods' && searchValue){

      try {
        const code = encodeURIComponent(searchValue);
        // console.log('Encoded Code:', code); // Check what is being sent
        const response = await axiosInstance.get(
          `/search/finishedGoods?code=${code}`
        );

        const materials = response?.data?.materials
        if (materials && materials.length > 0) {
            toast.success(response.data.message)
          const results = response.data.materials
          if(results.qcDetails)
          {
            onSearchMaterials({
              materials:results,
              qcDetails:results.qcDetails
            })
          }
          else{
            onSearchMaterials({materials:results})
          }

        } else {
          toast.error('No materials found for the given code.')
        
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch material details.'
        toast.error(errorMessage)
        console.error(
          'Error fetching material details for traceability search:',
          err.message
        )
       
      }
    }    else {
      toast.error('Please select any one option and enter a value')
    }
  }

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2 // Space between elements
        }}
      >
        {/* Dropdown Menu */}
        <TextField
          select
          label='Filter By'
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value='materials'>Raw Materials</MenuItem>
          <MenuItem value='finishedGoods'>Finished Goods</MenuItem>
        </TextField>

        {/* Search Input */}
        <TextField
          label='Search'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ flex: 1 }} // Allows the search bar to grow/shrink as needed
        />

        {/* Search Button */}
        <Button
          variant='contained'
          color='success'
          onClick={handleSearch}
          sx={{
            textTransform: 'none',
            borderRadius: 2 // Rounded corners
          }}
        >
          Search
        </Button>
      </Box>
    </>
  )
}

export default SearchBoxWithDropdown
