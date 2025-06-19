import { Box, Container, Grid, MenuItem, Modal, Paper, TextField, Typography } from "@mui/material"
import  Button  from "@mui/material/Button"
import { useState } from "react"
import { Iconify } from 'src/components/iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}
export const DynamicModal = ({
    buttonType='button',
    buttonText='View',
    buttonIcon='solar:eye-bold',
    modalTitle="Details",
    modalSubtitle='',
    data={},
    fields=[],
    children,
    renderCustomContent,
    onOpen  


})=>{
    const [open,setOpen]=useState(false)
    const handleOpen=()=>{
        if(onOpen)onOpen()
        setOpen(true)
    }
    const handleClose=()=>setOpen(false)
    const renderTrigger=()=>{
        switch(buttonType){
            case 'menuItem':
                return (
                    <MenuItem onClick={handleOpen}>
                        <Iconify icon={buttonIcon} sx={{mr:1}}/>
                    </MenuItem>
                )
            case 'custom':
                return children
                default:
                return(
                    <Button variant='outlined' onClick={handleOpen} startIcon={<Iconify icon={buttonIcon}/>}>
                        {buttonText}
                      
                    </Button>
                )
        }
    }
    return (
        <div>
            {renderTrigger()}
            <Modal open={open} onClose={handleClose}>
                <Container maxWidth='xl' sx={{mt:4,mb:4}}>
                    <Paper elevation={4} sx={{p:4,backgroundColor:"#f9f9f9",borderRadius:2}}>
                        <Box sx={{textAlign:'center',mb:3}}>
                            <Typography variant="h5" fontWeight='bold' color='primary' gutterBottom>
                                {modalTitle}
                            </Typography>
                            {modalSubtitle && (
                                <Typography variant="body2" color='textSecondary'>{modalSubtitle}</Typography>
                            )}
                        </Box>
                        {renderCustomContent ? (
                            renderCustomContent(data)
                        ):(
                            <Grid container spacing={2}>
                                {fields.map((field,index)=>(
                                    <Grid item xs={field.xs||6} key={index}>
                                        <TextField fullWidth label={field.label} value={data[field.name]||"N/A"}
                                        variant="filled" InputProps={{readOnly:true,style:field.style||{borderRadius:8},
                                      
                                    
                                        }}
                                          multiline={field.multiline}
                                          rows={field.rows}/>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Container>
            </Modal>
        </div>
    )
}
