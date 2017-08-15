var fs = require('fs'),
    xml2js = require('xml2js');
var MongoClient = require("mongodb").MongoClient;
var fullXML;
var parser = new xml2js.Parser();
var year = 2017;
var month = 'February';
var detellization;

fs.readFile('imlight/xml/ИП февраль.xml','utf-8',function(error,data){
  console.log('Read...');
  parser.parseString(data,function (error,result){
    fullXML =  result;
    detallization ={
      tel: []
    };
    // Парсим ветку TP
     for (var i=0;i<fullXML.Report.tp.length;i++){
       detallization.tel[i]= {
         phoneNumber:fullXML.Report.tp[i]['$'].n,
         servicesSum:fullXML.Report.tp[i]['$'].awt,
         callsSum:fullXML.Report.ds[i]['$'].t,
         tariff:fullXML.Report.tp[i].ts[0]['$'].n,
         callsAll:[],
         service:[],
         year:year,
         month:month
       };
       //Обслуживани7

       if(fullXML.Report.tp[i].ss){
         for (var j = 0; j < fullXML.Report.tp[i].ss.length; j++) {
           detallization.tel[i].service[j]={
             nameService:fullXML.Report.tp[i].ss[j]['$'].n,
             sumSer:fullXML.Report.tp[i].ss[j]['$'].awt
           }
         }
       }
       //Парсим ветку DS (Телефонные услуги)
       if(fullXML.Report.ds[i].i){
        for(var j=0;j<fullXML.Report.ds[i].i.length;j++){
          detallization.tel[i].callsAll[j]={
            date:fullXML.Report.ds[i].i[j]['$'].d,
            oneService:fullXML.Report.ds[i].i[j]['$'].n,
            priceService:fullXML.Report.ds[i].i[j]['$'].c,
            time:fullXML.Report.ds[i].i[j]['$'].du,
          }
        }
     }
    }

    MongoClient.connect("mongodb://localhost:27017/mtc",function (err,db){
      db.collection("mtc").insertMany(detallization.tel, function (err,result) {
        if (err){return console.log(err);}
         console.log(result.ops);
        db.close();
      });
    });
   console.log(detallization);
   });
});
