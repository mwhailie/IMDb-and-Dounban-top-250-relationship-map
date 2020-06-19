// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


// var color = isActor ? "rgba(45,160,45,1)":"rgba(255,127,15,1)";
var imdbActors = ["Robert De Niro", "Harrison Ford", "Tom Hanks", "Aamir Khan", "Charles Chaplin", "Christian Bale", 
    "Clint Eastwood", "Leonardo DiCaprio", "Toshirô Mifune"]
var imdbActorsCount = [9, 6, 6, 5, 5, 5, 5, 5, 5];

var imdbDirectors = ["Akira Kurosawa ", "Christopher Nolan ", "Martin Scorsese ", "Stanley Kubrick ", "Alfred Hitchcock ", "Steven Spielberg ", 
    "Billy Wilder ", "Charles Chaplin ", "Hayao Miyazaki ", "Quentin Tarantino "]
var imdbDirectorsCount = [7, 7, 7, 7, 6, 6, 5, 5, 5, 5];

var doubanActors = ["周星驰", "张国荣", "汤姆·汉克斯", "莱昂纳多·迪卡普里奥", "丹尼尔·雷德克里夫", "布拉德·皮特", 
    "张曼玉", "梁朝伟", "艾玛·沃森", ]
var doubanActorsCount = [6, 6, 6, 6, 5, 5, 5, 5, 5];

var doubanDirectors = ["克里斯托弗·诺兰", "史蒂文·斯皮尔伯格", "宫崎骏", "李安", "王家卫", "大卫·芬奇", 
    "是枝裕和", "刘镇伟", "姜文", "弗朗西斯·福特·科波拉", "彼得·杰克逊", "朱塞佩·托纳多雷","理查德·林克莱特", "詹姆斯·卡梅隆"]
var doubanDirectorsCount = [7, 7, 7, 5, 5, 4, 4, 3, 3, 3, 3, 3, 3, 3];

var isIMDb = document.getElementById("actorBarChart").getAttribute("isIMDb");

var actors = (isIMDb === "true")? imdbActors : doubanActors;
var actorsCount = (isIMDb === "true")? imdbActorsCount : doubanActorsCount;
var directors = (isIMDb === "true")? imdbDirectors : doubanDirectors;
var directorsCount = (isIMDb === "true")? imdbDirectorsCount : doubanDirectorsCount;
// Bar Chart Example
var ctx = document.getElementById("actorBarChart");
var myLineChart = new Chart(ctx, {
  type: 'horizontalBar',
  data: {
    labels: actors,
    datasets: [{
      label: "Count",
      backgroundColor: "rgba(255,127,15,1)",
      borderColor: "rgba(255,127,15,1)",
      data: actorsCount,
    }],
  },
  options: {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          min: 0,
          max: (isIMDb === "true") ?  10 : 6,
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 10,
          maxTicksLimit: 5,
          autoSkip: false
        },
        gridLines: {
          display: false
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
var ctx2 = document.getElementById("directorBarChart");
var directorBarChart = new Chart(ctx2, {
  type: 'horizontalBar',
  data: {
    labels: directors,
    datasets: [{
      label: "Count",
      backgroundColor: "rgba(45,160,45,1)",
      borderColor: "rgba(45,160,45,1)",
      data: directorsCount,
    }],
  },
  options: {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          min: 0,
          max: 8,
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 10,
          maxTicksLimit: 5,
          autoSkip: false
        },
        gridLines: {
          display: false
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
