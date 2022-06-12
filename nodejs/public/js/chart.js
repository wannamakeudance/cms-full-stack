window.addEventListener("load", async function () {

    getchart();


    async function getchart() {
        const response = await fetch("./getchartinformation");
        const chartinformation = await response.json();
        
            var xValues = new Array();
            var yValues = new Array();
            for (let i = 0; i < chartinformation.length; i++) {
                xValues[i] = chartinformation[i].DailyDate;
                yValues[i] = chartinformation[i].TotalComments;
            }
            new Chart("myChart", {
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                       
                        backgroundColor: "rgba(0,0,255,1.0)",
                        data: yValues
                    }]
                },
                options: {
                    legend: { display: false },
                    scales:{
                        yAxes:[{ticks:{min:0}}],
                    },
                    title: {
                        display: true,
                        text: "Daily Total Comments"
                    }
                   
                }
            });
        

    }

});