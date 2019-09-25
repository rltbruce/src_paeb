(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.localisation.region')
        .controller('RegionController', RegionController);
    /** @ngInject */
    function RegionController($mdDialog, $scope, apiFactory, $state)
    {
        var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allregion = [] ;
        vm.showTableRegion = true;

        vm.ajout_district = ajout_district ;
        var NouvelItem_district=false;
        var currentItem_district;
        vm.selectedItem_district = {} ;
        vm.alldistrict= [] ; 
        vm.boutonAjoutDistrict = false;
        vm.showTableDistrict = true;

        vm.ajout_commune = ajout_commune ;
        var NouvelItem_commune=false;
        var currentItem_commune;
        vm.selectedItem_commune = {} ;
        vm.allcommune= [] ; 
        vm.boutonAjoutCommune = false;
        vm.showTableCommune = true;       
       
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true,
          order : [1,'asc'],
          iDisplayLength : 5,
          lengthMenu : [ 5,10, 25, 50, 100 ]
          
        };

        //col table
        vm.region_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];
        vm.district_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];
        vm.commune_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];


/* ***************DEBUT REGION**********************/
       
        apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion = result.data.response; 
            console.log(vm.allregion);
        });
        
        function ajout(region,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (region,suppression); 
            } 
            else
            {
                insert_in_base(region,suppression);
            }
        }
        
        //fonction d'insertion ou mise a jours ou suppression item dans bdd region
        function insert_in_base(region,suppression)
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
                    code:      region.code,
                    nom:       region.nom               
                });
                //console.log(region.pays_id);
                //factory
            apiFactory.add("region/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.nom        = region.nom;
                        vm.selectedItem.code       = region.code;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allregion = vm.allregion.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  region.nom =  region.nom;
                  region.code=  region.code;
                  region.id  =   String(data.response);              
                  NouvelItem=false;
            }
              region.$selected = false;
              region.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
            if (vm.selectedItem.id!='0')
            {
              apiFactory.getAPIgeneraliserREST("district/index","id_region",item.id).then(function(result)
              {
                  vm.alldistrict= result.data.response; 
                  vm.boutonAjoutDistrict = true;
              });
            }
            vm.allcommune= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allregion) return;
             vm.allregion.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });
        
        //function cache masque de saisie ajout region
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              nom: ''
            }; 
           // vm.selectedItem.$selected = false;         
            vm.allregion.push(items);
            vm.allregion.forEach(function(reg)
            {
              if(reg.$selected==true)
              {
                vm.selectedItem = reg;
              }
            });

            NouvelItem = true ;
            vm.boutonAjoutDistrict = false;
            vm.alldistrict = [];
          }else
          {
            vm.showAlert('Ajout Region','Un formulaire d\'ajout est déjà ouvert!!!');
          }
                
                      
        };

        //fonction de bouton d'annulation region
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.nom       = currentItem.nom ; 
          }else
          {
            vm.allregion = vm.allregion.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };
        //fonction masque de saisie modification region
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allregion.forEach(function(reg) {
              reg.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.nom       = vm.selectedItem.nom ; 
        };
        
        //fonction bouton suppression item region
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout(vm.selectedItem,1);
                vm.boutonAjoutDistrict = false;
              }, function() {
                //alert('rien');
              });
        };

         //function teste s'il existe une modification item region
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var reg = vm.allregion.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(reg[0])
                {
                   if((reg[0].nom!=currentItem.nom) || (reg[0].code!=currentItem.code))                    
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

        vm.show_region = function()
        {
          vm.showTableRegion = !vm.showTableRegion;
        }
/* ***************FIN REGION**********************/        

/* ***************DEBUT DISTRICT**********************/
        function ajout_district(district,suppression)
        {
            if (NouvelItem_district==false)
            {
                test_existance_district (district,suppression); 
            } 
            else
            { 
                insert_in_base_district(district,suppression);
            }
        }

        //fonction d'insertion ou mise a jours ou suppression item dans bdd district
        function insert_in_base_district(district,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var getId = 0;
            if (NouvelItem_district==false)
            {
                getId = vm.selectedItem_district.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      district.code,
                    nom:       district.nom,
                    id_region: vm.selectedItem.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("district/index",datas, config).success(function (data)
            {
                if (NouvelItem_district == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem_district.nom        = district.nom;
                        vm.selectedItem_district.code       = district.code;
                        vm.selectedItem_district.$selected  = false;
                        vm.selectedItem_district.$edit      = false;
                        vm.selectedItem_district ={};
                    }
                    else 
                    {    
                      vm.alldistrict = vm.alldistrict.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem_district.id;
                      });
                    }
                }
                else
                {
                  district.nom =  district.nom;
                  district.code=  district.code;
                  district.id  =   String(data.response);              
                  NouvelItem_district=false;
            }
              district.$selected = false;
              district.$edit = false;
              vm.selectedItem_district = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //fonction selection item district
        vm.selection_district= function (item)
        {
            vm.selectedItem_district = item;
            vm.NouvelItem_district   = item;
            currentItem_district     = JSON.parse(JSON.stringify(vm.selectedItem_district));
            if (vm.selectedItem_district.id!='0')
            {
              apiFactory.getAPIgeneraliserREST("commune/index","id_district",item.id).then(function(result)
              {
                  vm.allcommune= result.data.response;
                  vm.boutonAjoutCommune = true; 
                  console.log(vm.allcommune);
              });
            
            }
           //console.log(vm.selectedItem_distric);
        };
        $scope.$watch('vm.selectedItem_district', function()
        {
             if (!vm.alldistrict) return;
             vm.alldistrict.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_district.$selected = true;
        });

        //function cache masque de saisie ajout district
        vm.ajouter_district = function ()
        { 
          if (NouvelItem_district == false)
          {
            var items_district = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              nom: ''
            }; 
           // vm.selectedItem.$selected = false;
            NouvelItem_district = true ;        
            vm.alldistrict.push(items_district);
            vm.alldistrict.forEach(function(dist)
            {
              if(dist.$selected==true)
              {
                vm.selectedItem_district = dist;
              }
            });
            vm.boutonAjoutCommune = false; 
            vm.allcommune = [];
          }else
          {
            vm.showAlert('Ajout District','Un formulaire d\'ajout est déjà ouvert!!!');
          }         
                      
        };

        //fonction de bouton d'annulation district
        vm.annuler_district = function(item)
        {
          if (NouvelItem_district == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem_district.code ;
            item.nom       = currentItem_district.nom ; 
          }else
          {
            vm.alldistrict = vm.alldistrict.filter(function(obj)
            {
                return obj.id !== vm.selectedItem_district.id;
            });
          }

          vm.selectedItem_district = {} ;
          NouvelItem_district      = false;
          
        };

        //fonction masque de saisie modification district
        vm.modifier_district = function(item)
        {
            NouvelItem_district = false ;
            vm.selectedItem_district = item;
            currentItem_district = angular.copy(vm.selectedItem_district);
            vm.alldistrict.forEach(function(dist) {
              dist.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem_district.code ;
            item.nom       = vm.selectedItem_district.nom ; 
        };

        //fonction bouton suppression item district
        vm.supprimer_district = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout_district(vm.selectedItem_district,1);
                vm.boutonAjoutCommune = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item region
        function test_existance_district (item,suppression)
        {          
            if (suppression!=1)
            {
               var dist = vm.alldistrict.filter(function(obj)
                {
                   return obj.id == currentItem_district.id;
                });
                if(dist[0])
                {
                   if((dist[0].nom!=currentItem_district.nom) || (dist[0].code!=currentItem_district.code))                    
                      { 
                         insert_in_base_district(item,suppression);
                      }
                      else
                      {  
                        item.$selected = false;
                        item.$edit = false;
                      }
                }
            } else  
                  insert_in_base_district(item,suppression);

        }

        vm.show_district = function()
        {
          vm.showTableDistrict = !vm.showTableDistrict;
        }
        

/* ***************FIN DISTRICT**********************/

/* ***************DEBUT COMMUNE**********************/
        function ajout_commune(commune,suppression)
        {
            if (NouvelItem_commune==false)
            {
                test_existance_commune (commune,suppression); 
            } 
            else
            { 
                insert_in_base_commune(commune,suppression);
            }
        }

        //fonction d'insertion ou mise a jours ou suppression item dans bdd commune
        function insert_in_base_commune(commune,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var getId = 0;
            if (NouvelItem_commune==false)
            {
                getId = vm.selectedItem_commune.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      commune.code,
                    nom:       commune.nom,
                    id_district: vm.selectedItem_district.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("commune/index",datas, config).success(function (data)
            {
                if (NouvelItem_commune == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem_commune.nom        = commune.nom;
                        vm.selectedItem_commune.code       = commune.code;
                        vm.selectedItem_commune.$selected  = false;
                        vm.selectedItem_commune.$edit      = false;
                        vm.selectedItem_commune ={};
                    }
                    else 
                    {    
                      vm.allcommune = vm.allcommune.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem_commune.id;
                      });
                    }
                }
                else
                {
                  commune.nom =  commune.nom;
                  commune.code=  commune.code;
                  commune.id  =   String(data.response);              
                  NouvelItem_commune=false;
            }
              commune.$selected = false;
              commune.$edit = false;
              vm.selectedItem_commune = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //fonction selection item commune
        vm.selection_commune= function (item)
        {
            vm.selectedItem_commune = item;
            vm.NouvelItem_commune   = item;
            currentItem_commune     = JSON.parse(JSON.stringify(vm.selectedItem_commune));
            //console.log(vm.selectedItem_distric);
        };
        $scope.$watch('vm.selectedItem_commune', function()
        {
             if (!vm.allcommune) return;
             vm.allcommune.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_commune.$selected = true;
        });

        //function cache masque de saisie ajout commune
        vm.ajouter_commune = function ()
        { 
          if (NouvelItem_commune == false)
          {
            var items_commune = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              nom: ''
            }; 
           // vm.selectedItem.$selected = false;
            NouvelItem_commune = true ;         
            vm.allcommune.push(items_commune);
            vm.allcommune.forEach(function(com)
            {
              if(com.$selected==true)
              {
                vm.selectedItem_commune = com;
              }
            });
          }else
          {
            vm.showAlert('Ajout commune','Un formulaire d\'ajout est déjà ouvert!!!');
          }         
                      
        };

        //fonction de bouton d'annulation commune
        vm.annuler_commune = function(item)
        {
          if (NouvelItem_commune == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem_commune.code ;
            item.nom       = currentItem_commune.nom ; 
          }else
          {
            vm.allcommune = vm.allcommune.filter(function(obj)
            {
                return obj.id !== vm.selectedItem_commune.id;
            });
          }

          vm.selectedItem_commune = {} ;
          NouvelItem_commune      = false;
          
        };

        //fonction masque de saisie modification commune
        vm.modifier_commune = function(item)
        {
            NouvelItem_commune = false ;
            vm.selectedItem_commune = item;
            currentItem_commune = angular.copy(vm.selectedItem_commune);
            vm.allcommune.forEach(function(com) {
              com.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem_commune.code ;
            item.nom       = vm.selectedItem_commune.nom ; 
        };

        //fonction bouton suppression item commune
        vm.supprimer_commune = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout_commune(vm.selectedItem_commune,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item region
        function test_existance_commune (item,suppression)
        {          
            if (suppression!=1)
            {
               var com = vm.allcommune.filter(function(obj)
                {
                   return obj.id == currentItem_commune.id;
                });
                if(com[0])
                {
                   if((com[0].nom!=currentItem_commune.nom) || (com[0].code!=currentItem_commune.code))                    
                      { 
                         insert_in_base_commune(item,suppression);
                      }
                      else
                      {  
                        item.$selected = false;
                        item.$edit = false;
                      }
                }
            } else  
                  insert_in_base_commune(item,suppression);

        }

        vm.show_commune = function()
        {
          vm.showTableCommune = !vm.showTableCommune;
        }
        

/* ***************FIN COMMUNE**********************/
        
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
