(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.ecole')
        .controller('EcoleController', EcoleController);
    /** @ngInject */
    function EcoleController($mdDialog, $scope, apiFactory, $state, uiGmapGoogleMapApi)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allecole = [] ;

        vm.allcommune = [] ;

        vm.vuemap = false;
        vm.liste = [] ;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.ecole_column = [{titre:"Code"},{titre:"Description"},{titre:"Lieu"},{titre:"Commune"},{titre:"Latitude"},{titre:"Longitude"},{titre:"Altitude"},{titre:"Ponderation"},{titre:"Action"}];
        
        //recuperation donnée ecole
        apiFactory.getAll("ecole/index").then(function(result)
        {
            vm.allecole = result.data.response; 
            console.log(vm.allecole);
            vm.allecole.forEach(function(item)
            {
              var site = {
                id: item.id,
                coords:{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  lieu: item.lieu,
                  description: item.description,
                  code: item.code,
                  ponderation: item.ponderation,
                }
                
              };
              vm.liste.push(site);              
            });
            console.log(vm.liste);
        });
/*
 $scope.events = {
        mouseover: function (marker, eventName, model, args) {
          //model.options.labelContent = "Position - lat: " + model.latitude + " lon: " + model.longitude;
        
        //marker.show = true;
        $scope.activemarker=marker;
       // $scope.activemarker.show=true;
//console.log($scope.activemarker.show);
       // $scope.ec.push({show:true});
        //vm.show = true;
         // $scope.$apply();
        },
        mouseout: function (marker, eventName, model, args) {
          // model.options.labelContent = " ";
          // marker.showWindow = false;
          
          //marker.show=false;
         // console.log(marker.show);
          //console.log(false);
          //$scope.$apply();
        }
    }
       */

        //recuperation donnée commune
        apiFactory.getAll("commune/index").then(function(result)
        {
          vm.allcommune= result.data.response;
        });

         vm.ecolevueMap = {
                        center: {
                            latitude : -18.881728,
                            longitude: 47.510447
                        },
                        zoom  : 5,
                        marker: vm.liste
                    };

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              description: '',
              lieu: '',
              id_commune: '',         
              latitude: '',
              longitude: '',
              altitude: '',
              ponderation: 0
            };         
            vm.allecole.push(items);
            vm.allecole.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout ecole','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(ecole,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (ecole,suppression); 
            } 
            else
            {
                insert_in_base(ecole,suppression);
            }
        }

        //fonction de bouton d'annulation ecole
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.description = currentItem.description ;
            item.lieu = currentItem.lieu ;
            item.id_commune  = currentItem.id_commune ;
            item.latitude    = currentItem.latitude ;
            item.longitude   = currentItem.longitude ;
            item.altitude    = currentItem.altitude ;
            item.ponderation    = currentItem.ponderation ; 
          }else
          {
            vm.allecole = vm.allecole.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.allecole= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allecole) return;
             vm.allecole.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item ecole
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allecole.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.description = vm.selectedItem.description;
            item.lieu = vm.selectedItem.lieu;
            item.id_commune  = vm.selectedItem.commune.id;
            item.latitude      = vm.selectedItem.latitude ;
            item.longitude = vm.selectedItem.longitude;
            item.altitude  = vm.selectedItem.altitude;
            item.ponderation  = vm.selectedItem.ponderation; 
        };

        //fonction bouton suppression item ecole
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enecoleistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout(vm.selectedItem,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item ecole
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allecole.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].code!=currentItem.code)
                    || (cis[0].lieu!=currentItem.lieu)
                    || (cis[0].id_commune!=currentItem.id_commune)
                    || (cis[0].latitude!=currentItem.latitude)
                    || (cis[0].longitude!=currentItem.longitude)
                    || (cis[0].altitude!=currentItem.altitude)
                    || (cis[0].ponderation!=currentItem.ponderation))                    
                      { 
                         insert_in_base(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_base(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd ecole
        function insert_in_base(ecole,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      ecole.code,
                    lieu:      ecole.lieu,      
                    latitude:    ecole.latitude,
                    longitude:   ecole.longitude,
                    altitude:    ecole.altitude,
                    id_commune:  ecole.id_commune,
                    description: ecole.description,
                    ponderation: ecole.ponderation               
                });
                //console.log(ecole.pays_id);
                //factory
            apiFactory.add("ecole/index",datas, config).success(function (data)
            {
                
                var com = vm.allcommune.filter(function(obj)
                {
                    return obj.id == ecole.id_commune;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description = ecole.description;
                        vm.selectedItem.code       = ecole.code;
                        vm.selectedItem.lieu       = ecole.lieu;
                        vm.selectedItem.latitude   = ecole.latitude;
                        vm.selectedItem.longitude  = ecole.longitude;
                        vm.selectedItem.altitude   = ecole.altitude;
                        vm.selectedItem.ponderation   = ecole.ponderation;
                        vm.selectedItem.commune       = com[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allecole = vm.allecole.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  ecole.description =  ecole.description;
                  ecole.code      =  ecole.code;
                  ecole.lieu      =  ecole.lieu;
                  ecole.latitude  =  ecole.latitude;
                  ecole.longitude =  ecole.longitude;
                  ecole.altitude  =  ecole.altitude;
                  ecole.ponderation  =  ecole.ponderation;
                  ecole.commune   = com[0];
                  ecole.id        =   String(data.response);              
                  NouvelItem = false;
            }
              ecole.$selected = false;
              ecole.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

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

vm.polylines = [
            {
                id: 1,
                path: [
                    {
                        latitude: -13.586724,
                        longitude: 47.958293 , 
                    },
                    {
                        latitude: -14.025779,
                        longitude: 48.047114 , 
                    },
                    {
                        latitude: -13.992726,
                        longitude: 48.090419
                    },
                    {
                        latitude: -13.966392, 
                        longitude: 48.084645,
                    },
                    {
                        latitude: -13.876931, 
                        longitude: 48.234667,
                    },
                    {
                        latitude: -13.894659, 
                        longitude: 48.259596,
                    },
                    {
                        latitude: -14.012895,
                        longitude: 48.174141
                    },
                    {
                        latitude: -14.013105, 
                        longitude: 48.174384,
                    },
                    {
                        latitude: -14.034495, 
                        longitude: 48.200923,
                    },
                    {
                        latitude: -14.018789,
                        longitude: 48.242270 , 
                    },
                    {
                        latitude: -14.069342,
                        longitude: 48.272315
                    },
                    {
                        latitude: -14.071226, 
                        longitude: 48.299803,
                    },
                    {
                        latitude: -14.122543, 
                        longitude: 48.365796,
                    },
                    {
                        latitude: -14.121721, 
                        longitude: 48.470424,
                    },
                    {
                        latitude: -14.078683,
                        longitude: 48.536567
                    },
                    {
                        latitude: -14.141488, 
                        longitude: 48.581585,
                    },
                    {
                        latitude: -14.141124, 
                        longitude: 48.623868,
                    },
                    {
                        latitude: -14.216036,
                        longitude: 48.701767 , 
                    },
                    {
                        latitude: -14.189243,
                        longitude: 48.797683
                    },
                    {
                        latitude: -14.255137, 
                        longitude: 48.837552,
                    },
                    {
                        latitude: -14.148160, 
                        longitude: 48.971524,
                    },
                    {
                        latitude: -14.202813, 
                        longitude: 49.087365,
                    },
                    {
                        latitude: -14.204431,
                        longitude: 49.132823
                    },
                    {
                        latitude: -14.266465, 
                        longitude: 49.140986,
                    },
                    {
                        latitude: -14.441563, 
                        longitude: 49.309307,
                    },
                    {
                        latitude: -14.508693,
                        longitude: 49.411704 , 
                    },
                    {
                        latitude: -14.563009,
                        longitude: 49.369156
                    },
                    {
                        latitude: -14.671869, 
                        longitude: 49.443677,
                    },
                    {
                        latitude: -14.727503, 
                        longitude: 49.464658,
                    },
                    {
                        latitude: -14.826594, 
                        longitude: 49.482034,
                    },
                    {
                        latitude: -14.826150,
                        longitude: 49.5147799
                    },
                    {
                        latitude: -14.914193, 
                        longitude: 49.590374,
                    },
                    {
                        latitude: -14.938912, 
                        longitude: 49.593879,
                    },
                    {
                        latitude: -15.084998,
                        longitude: 49.724461, 
                    },
                    {
                        latitude: -15.045005,
                        longitude: 49.843485
                    },
                    {
                        latitude: -15.061595, 
                        longitude: 49.908579,
                    },
                    {
                        latitude: -15.042411, 
                        longitude: 49.938876,
                    },
                    {
                        latitude: -15.192719,
                        longitude: 50.050715
                    },
                    {
                        latitude: -15.255758,
                        longitude: 49.993575
                    },
                    {
                        latitude: -15.302653, 
                        longitude: 50.034675,
                    },
                    {
                        latitude: -15.340297, 
                        longitude: 50.017314,
                    },
                    {
                        latitude: -15.401211,
                        longitude: 50.020597, 
                    },
                    {
                        latitude: -15.436742,
                        longitude: 50.058384
                    },
                    {
                        latitude: -15.471482, 
                        longitude: 50.061167,
                    },
                    {
                        latitude: -15.482382, 
                        longitude: 50.048577,
                    },
                    {
                        latitude: -15.581120, 
                        longitude: 50.021809,
                    },
                    {
                        latitude: -15.641728,
                        longitude: 50.045253
                    },
                    {
                        latitude: -15.748891, 
                        longitude: 50.067484,
                    },
                    {
                        latitude: -15.771226, 
                        longitude: 50.093409,
                    },
                    {
                        latitude: -15.813575, 
                        longitude: 50.094221,
                    },
                    {
                        latitude: -15.937040,
                        longitude: 50.132703
                    },
                    {
                        latitude: -15.265595,
                        longitude: 50.468376
                    },
                    {
                        latitude: -11.971159,
                        longitude: 49.264396
                    },
                    {
                        latitude: -13.586724,
                        longitude: 47.958293 , 
                    }
                ],
                stroke: {
                    color: '#6060FB',
                    weight: 1
                },
                //editable: true,
                //draggable: true,
                //geodesic: true,
                //visible: true,
                fill: {
                    
                    opacity: 0
                     
                },
                events: { 
                  click: function()
                  { 
                  console.log("click ok"); 
                  },
                  mouseover: function(gPoly, eventName, polyModel, latLngArgs) {
                    polyModel.fill.opacity = '0.5';
                   console.log("mouseover ok");
                  },
                  mouseout: function(gPoly, eventName, polyModel, latLngArgs) {
                    polyModel.fill.opacity = '0';
                    console.log("mouseout ok");
                  }
                },
                
            },
            {
                id: 2,
                path: [
                    {
                        latitude: 47,
                        longitude: -74
                    },
                    {
                        latitude: 32,
                        longitude: -89
                    },
                    {
                        latitude: 39,
                        longitude: -122
                    },
                    {
                        latitude: 62,
                        longitude: -95
                    }
                ],
                stroke: {
                    color: '#FF7F00',
                    weight: 3
                },
                editable: true,
                draggable: true,
                geodesic: true,
                visible: true,
                
            }
        ];
  



    }
})();
