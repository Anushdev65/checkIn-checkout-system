// all function returns in iso format
//iso format is
// YYYY-MM-DDTHH:MM:SSZ
export let currentDayStartOf = () => {
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    return start;
  };
  
  export let currentDayEndOf = () => {
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  };
  