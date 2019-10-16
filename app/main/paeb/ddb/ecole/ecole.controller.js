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
    }
})();
