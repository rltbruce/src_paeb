(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting_map')
        .controller('Reporting_mapController', Reporting_mapController);
    /** @ngInject */
    function Reporting_mapController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,apiUrlexcel)
    { 
        var vm = this;  

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
          console.log('mande');
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
            vm.polylines = [];
            vm.parameters =[];
            vm.ecolevueMap = {
                        center: {
                            latitude : -18.881728,
                            longitude: 47.510447
                        },
                        zoom  : 6,
                        marker: vm.liste
                    };
        vm.showmap = false;
        //vm.showwindow = true;
           apiFactory.getAPIgeneraliserREST("district/index","menu",'reportingvuecarte2').then(function(result)
            {
                vm.districts = result.data.response;
                console.log(vm.districts);

                angular.forEach(vm.districts, function(data)
                {

                    var item = 
                    {
                      id: data.id ,
                      id_marker: "marker"+data.id ,
                      id_window: "window"+data.id ,
                      path:data.coordonnees,
                      nom_district:data.nom,
                      marker_coord:vm.get_center_poly(data.coordonnees),
                      reporting:data.reporting,
                      //marker_option:{
                      //  icon:'assets/images/logos/mapmarker.png'
                      //},                     
                      stroke: {
                          color: '#777777',
                          weight: 1
                      },                  
                      fill: {                          
                          opacity: 0                           
                      },
                      events: { 
                        click: function(event)
                        { 
                          console.log(event);
                          vm.data_dialogs = data;
                          vm.showreportingDialog();
                        },
                        mouseover: function(gPoly, eventName, polyModel, latLngArgs)
                        {
                          polyModel.fill.opacity = '0.5';
                          console.log("mouseover ok");
                          vm.showwindow = "window"+data.id;
                        },
                        mouseout: function(gPoly, eventName, polyModel, latLngArgs)
                        {
                          polyModel.fill.opacity = '0';
                          vm.showwindow = "window"+0;
                          console.log("mouseout ok");
                         // $mdDialog.cancel();
                        }
                      }
                    }; 

                      vm.polylines.push(item);
                      if (vm.polylines.length == 111)
                     {
                        vm.showmap = true;
                        console.log(vm.showmap);
                     };

                   /// if (data.id==1) {
                     //  vm.polylines.push(item);
                     // if (vm.polylines.length == 1)
                    // {
                    //    vm.showmap = true;
                    //    console.log(vm.showmap);
                    // }
                      
                   // }                     
                });
            });

            vm.get_center_poly = function(path)
            {
              
              var centroid = [];
              centroid[0] = 0.0 ;
              centroid[1] = 0.0 ;
              if (path)
              {


              path.forEach( function(element, index) 
              {
                centroid[0] += Number(element.latitude);
                centroid[1] += Number(element.longitude);
              });

              var totalPoints = path.length;
              centroid[0] = centroid[0] / totalPoints;
              centroid[1] = centroid[1] / totalPoints;
              }
              var pts = 
              {
                latitude : centroid[0],
                longitude : centroid[1]
              }

              return pts;

            }

            vm.showreportingDialog = function (ev)
            {
              var confirm = $mdDialog.confirm({
              controller: ReportingDialogController,
              templateUrl: 'app/main/paeb/reports/reporting_map/reporting_map_dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev, 
              
              })

                  $mdDialog.show(confirm).then(function(data)
                  {
                 
                  }, function(){//alert('rien');
                });

            } 
            function ReportingDialogController($mdDialog, $scope, apiFactory, $state)
            { 
                var dg=$scope;
                console.log(vm.data_dialogs);
                dg.data_dialog = vm.data_dialogs;
                dg.tOptions = {
                  dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                  pagingType: 'simple',
                  autoWidth: false          
                };

                dg.cancel = function()
                {
                  $mdDialog.cancel();
                };

                dg.dialognouveauajout = function(conven)
                {  
                    $mdDialog.hide(convention_a_anvoyer);
                }
                dg.to_upper= function(nom)
                { var nom_upper=""

                  if (nom) {
                    nom_upper = nom.toUpperCase();
                  }
                  return nom_upper
                }
                //format date affichage sur datatable

            } 
         
    }

    

})();
