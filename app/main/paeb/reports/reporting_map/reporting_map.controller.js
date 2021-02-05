(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting_map')
        .controller('Reporting_mapController', Reporting_mapController)
        .controller('ReportingDialogController', ReportingDialogController);
    /** @ngInject */
    function Reporting_mapController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,apiUrlexcel,$cookieStore)
    { 
        var vm = this;  
        vm.regions = [];
        vm.affiche_load = false;
        var id_user = $cookieStore.get('id');
        if (id_user > 0) 
        {

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
            {
                  var utilisateur = result.data.response;
                  console.log(utilisateur);
                  if (utilisateur.roles.indexOf("ADMIN")!= -1)
                  {
                    vm.session="ADMIN";
                  }

                  if (utilisateur.roles.indexOf("AAC")!= -1)
                  {
                    vm.session="AAC";
                  }
                  if (utilisateur.roles.indexOf("DPFI")!= -1)
                  {
                    vm.session="DPFI";
                  }              

             });
        }

        apiFactory.getAll("region/index").then(function success(response)
        {
           vm.regions=response.data.response;
        });
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
        vm.recherchefiltre = function(item_region)
        {   
            vm.affiche_load= true;
            var region_exist = false;
            apiFactory.getAPIgeneraliserREST("district/index","menu",'reportingvuecarte2','id_region',item_region.id_region).then(function(result)
            {
                vm.district_reports = result.data.response;
                console.log(vm.district_reports);
                var boucle = 0;
                angular.forEach(vm.district_reports, function(data)
                { 
                  if (vm.polylines.length!=0) 
                  {

                    var district_exist = vm.polylines.filter(function(obj)
                    {
                       return obj.id == data.id;
                    });
                    if (district_exist.length!=0)
                    {                      
                      region_exist = true;
                    }
                    else
                    {
                        var item = 
                        {
                          id: data.id ,
                          id_marker: "marker"+data.id ,
                          id_window: "window"+data.id ,
                          path:data.coordonnees,
                          nom_district:data.nom,
                          marker_coord:vm.get_center_poly(data.coordonnees),
                          //reporting:data.reporting,
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
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu",'reportingvuecarte','id_district',data.id).then(function(result)
                              {
                                  vm.data_dialogs = result.data.response;
                                vm.showreportingDialog();
                              });
                              vm.district_nom=data.nom;
                              
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
                    }
                    
                  }
                  else
                  {
                    var item = 
                        {
                          id: data.id ,
                          id_marker: "marker"+data.id ,
                          id_window: "window"+data.id ,
                          path:data.coordonnees,
                          nom_district:data.nom,
                          marker_coord:vm.get_center_poly(data.coordonnees),
                          //reporting:data.reporting,
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
                            click: function()
                            { 
                              //console.log(event);
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu",'reportingvuecarte','id_district',data.id).then(function(result)
                              {
                                  vm.data_dialogs = result.data.response;
                                  console.log(vm.data_dialogs);
                                vm.showreportingDialog();
                              });
                              vm.district_nom=data.nom;
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
                  } 
                  boucle = boucle +1;                   
                });
                  
                  if (vm.district_reports.length == boucle)
                  {                    
                    if (region_exist==true) 
                    {
                      vm.showAlert('Affichage refusé','Les districts de cette region sont déjà affichées');
                      region_exist = false;
                    }
                    vm.affiche_load = false;
                  }
                  console.log(vm.district_reports.length);
                  console.log(boucle);
            });
        }
           //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }

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

            vm.showreportingDialog = function ()
            {
              var confirm = $mdDialog.confirm({
              controller: ReportingDialogController,
              templateUrl: 'app/main/paeb/reports/reporting_map/reporting_map_dialog.html',
              parent: angular.element(document.body),
              locals:{dist: vm.district_nom, data:vm.data_dialogs, session:vm.session}
              });

                  $mdDialog.show(confirm).then(function()
                  {
                 
                  }, function(){//alert('rien');
                });

            } 
             
         
    }

    function ReportingDialogController($mdDialog, $scope,dist,data,session,$timeout)
            { 
                var dg=$scope;
               var self= this;
                console.log(dist);
                console.log(data);
                dg.alldataDialog = data;
                dg.district_nom = dist;
                dg.selectedItemDataDialog = {};
                dg.showracourci_dpfi = false;
                dg.showracourci_aac = false; 
                dg.showracourcie=false;
                dg.tOptions = {
                  dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                  pagingType: 'simple',
                  autoWidth: false ,
                  order:[]         
                };
                if (session=="ADMIN")
                  {
                    dg.showracourci_dpfi = true;
                    dg.showracourci_aac = true; 
                    dg.showracourcie=true;
                  }

                  if (session=="AAC")
                  {
                    dg.showracourci_aac = true;
                    dg.showracourcie=true;
                  }
                  if (session=="DPFI")
                  {
                    dg.showracourci_dpfi = true;
                    dg.showracourcie=true;
                  }

                dg.dataDialog_column = [
                  {titre:"Référence convention"
                  },
                  {titre:"CISCO"
                  },
                  {titre:"FEFFI"
                  },
                  {titre:"Avancement physique"
                  }
                  ];

                dg.cancel = function()
                {
                  $mdDialog.cancel();
                };
/*
                dg.dialognouveauajout = function()
                {  
                    $mdDialog.hide();
                }*/
                dg.to_upper= function(nom)
                { var nom_upper=""

                  if (nom) {
                    nom_upper = nom.toUpperCase();
                  }
                  return nom_upper
                }
                //format date affichage sur datatable
                dg.selectionDataDialog = function (item)
                {
                    dg.selectedItemDataDialog  = item; 
                    console.log(dg.selectedItemDataDialog) ;            
                };
                
              $scope.$watch('selectedItemDataDialog', function()
                {
                    if (!dg.alldataDialog) return;
                      dg.alldataDialog.forEach(function(iteme)
                      {
                          iteme.$selected = false;
                      });
                    dg.selectedItemDataDialog.$selected = true;
                });
               /* dg.topDirections = ['left', 'up'];
                dg.bottomDirections = ['down', 'right'];
                dg.isOpen = false;
                dg.availableModes = ['md-fling', 'md-scale'];
                dg.selectedMode = 'md-fling';
                dg.availableDirections = ['up', 'down', 'left', 'right'];
                dg.selectedDirection = 'up';*/
                $scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        selectedMode : 'md-fling',
        selectedDirection: 'left'
      };


            }

})();
