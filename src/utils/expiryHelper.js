export function isNearExpiry(expiryDate)
{
    if(!expiryDate)return false
    const today=new Date()
    const exp=new Date(expiryDate)
    const diff=(exp-today)/(1000*60*60*24)
    return diff<=30 && diff>0

}
export function isExpired(expiryDate)
{
    if(!expiryDate)return false
    const today=new Date()
    const exp=new Date(expiryDate)
    return exp<today
}
export function colorChangeOfExpiry(expiryDate)
{
  let rowBgColor=undefined
  if(isExpired(expiryDate))
  {
    rowBgColor="#f8d7da"
  }
  else if(isNearExpiry(expiryDate))
  {
    rowBgColor='#fff3cd'
  }
  return rowBgColor
}