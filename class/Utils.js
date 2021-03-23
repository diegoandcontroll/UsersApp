class Utils{
  static dateFormat(date){
    return date.getDate()+"/"+ "0" +(date.getMonth(1) + 1)+"/"+date.getFullYear() + " "+
    date.getHours()+":"+date.getMinutes();
  }
}