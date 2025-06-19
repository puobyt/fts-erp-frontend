import { Grid, TextField } from "@mui/material"
import { DynamicModal } from "../../utils/DynamicModal"


export const ViewQcDetails = ({qcData}) => {
  return (
    <DynamicModal buttonText="View QC" buttonIcon="solar:lab-test-bold" modalTitle="QC Inspection Details"
    modalSubtitle={`Batch :${qcData.batchNumber}`} data={qcData} renderCustomContent={(data)=>(
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <TextField fullWidth label="Material Name" value={data.materialName||"N/A"} variant="filled" InputProps={{readonly:true}}/>
            </Grid>
            <Grid item xs={6}>
                <TextField fullWidth label="Material Code" value={data.materialCode||"N/A"} variant="filled" InputProps={{readonly:true}}/>
            </Grid>
            <Grid item xs={6}>
                <TextField fullWidth label="Inspection Date" value={data.inspectionDate?new Date(data.inspectionDate).toLocaleDateString():"N/A"} variant="filled" InputProps={{readonly:true}}/>
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Quality Status" value={data.qualityStatus||"N/A"} variant="filled" InputProps={{readonly:true,style:{color:data.qualityStatus==="Pass"?"green":'red',fontWeight:'bold'}}}/>
            </Grid>
            <Grid item xs={6}>
                <TextField fullWidth label="Comments" value={data.comments||"N/A"} variant="filled" rows={3} InputProps={{readonly:true}}/>
            </Grid>
        </Grid>
    )}>

    </DynamicModal>
  )
}
