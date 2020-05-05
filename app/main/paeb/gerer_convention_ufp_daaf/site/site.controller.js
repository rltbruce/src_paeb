(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.site')
        .controller('SiteController', SiteController);
    /** @ngInject */
    function SiteController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allsite = [] ;
        vm.allclassification_site =[];
        vm.allagence_acc =[];

        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearch   = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.match = true;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false         
        };

        //col table
        vm.site_column = [
        {titre:"Epp"
        },
        {titre:"Code sous projet"
        },
        {titre:"objet sous projet"
        },
        //{titre:"Denomination epp"
       // },
        {titre:"Classification site"
        },
        {titre:"Lot"
        },
        {titre:"Agence d'accompagnemant"
        },
        {titre:"Statut"
        },
        {titre:"Observation"
        },
        {titre:"Action"}];
        
        //recuperation donnée site
        apiFactory.getAll("site/index").then(function(result)
        {
            vm.allsite = result.data.response;
        });
        apiFactory.getAll("classification_site/index").then(function(result)
        {
            vm.allclassification_site = result.data.response;
        });


        //recuperation donnée fokontany
        apiFactory.getAll("ecole/index").then(function(result)
        {
          vm.allecole= result.data.response;
          console.log(vm.allecole);
        });
        apiFactory.getAll("agence_acc/index").then(function(result)
        {
          vm.allagence_acc= result.data.response;
          console.log(vm.allecole);
        });

       function querySearch (query) {
         var results = query ? vm.allagence_acc.filter( createFilterFor(query) ) : vm.allagence_acc,
              deferred; 
           if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }
        function searchTextChange(text) {
         // $log.info('Text changed to ' + text);
          console.log('Text changed to ' + text);
        }
        function selectedItemChange(item) {
         // $log.info('Item changed to ' + JSON.stringify(item));
          console.log('Item changed to ' + JSON.stringify(item));
          vm.selectedItem.agence = item;
          console.log(item);
        }
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(state) {
            return (state.nom.toLowerCase().indexOf(lowercaseQuery) === 0);
          };
        }  

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code_sous_projet: '',
              objet_sous_projet: '',
              //denomination_epp: '',         
              observation: '',
              id_agence_acc: '',
              statu_convention: 0,
              id_ecole:'',
              id_classification_site:'',
              lot:''
            };         
            vm.allsite.push(items);
            vm.allsite.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout site','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(site,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (site,suppression); 
            } 
            else
            {
                insert_in_base(site,suppression);
            }
        }

        //fonction de bouton d'annulation site
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code_sous_projet      = currentItem.code_sous_projet ;
            item.objet_sous_projet = currentItem.objet_sous_projet ;
            //item.denomination_epp = currentItem.denomination_epp ;
            item.lot    = currentItem.lot ;
            item.observation    = currentItem.observation ;
            item.id_agence_acc   = currentItem.id_agence_acc ;
            item.statu_convention    = currentItem.statu_convention ;
            item.id_ecole    = currentItem.id_ecole; 
            item.id_classification_site    = currentItem.id_classification_site;
          }else
          {
            vm.allsite = vm.allsite.filter(function(obj)
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
           // vm.allsite= [] ;
           //console.log(item); 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allsite) return;
             vm.allsite.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item site
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allsite.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code_sous_projet      = vm.selectedItem.code_sous_projet ;
            item.objet_sous_projet = vm.selectedItem.objet_sous_projet;
            //item.denomination_epp = vm.selectedItem.denomination_epp;
            item.lot      = vm.selectedItem.lot ;
            item.observation      = vm.selectedItem.observation ;
            item.id_agence_acc = vm.selectedItem.agence_acc.id;
            item.statu_convention  = vm.selectedItem.statu_convention;
            item.id_ecole = vm.selectedItem.ecole.id ;
            item.id_classification_site = vm.selectedItem.classification_site.id ; 
        };

        //fonction bouton suppression item site
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet ensiteistrement ?')
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

        //function teste s'il existe une modification item site
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allsite.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].objet_sous_projet!=currentItem.objet_sous_projet) 
                    || (cis[0].code_sous_projet!=currentItem.code_sous_projet)
                    //|| (cis[0].denomination_epp!=currentItem.denomination_epp)
                    || (cis[0].observation!=currentItem.observation)
                    || (cis[0].id_agence_acc!=currentItem.id_agence_acc)
                    || (cis[0].statu_convention!=currentItem.statu_convention)
                    || (cis[0].id_ecole!=currentItem.id_ecole)
                    || (cis[0].lot!=currentItem.lot)
                    || (cis[0].id_classification_site!=currentItem.id_classification_site))                    
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

        //insertion ou mise a jours ou suppression item dans bdd site
        function insert_in_base(site,suppression)
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
                    code_sous_projet:      site.code_sous_projet,
                    //denomination_epp:      site.denomination_epp,      
                    lot:    site.lot,      
                    observation:    site.observation,
                    id_agence_acc:   site.id_agence_acc,
                    statu_convention:    site.statu_convention,
                    objet_sous_projet: site.objet_sous_projet,
                    id_ecole: site.id_ecole,
                    id_classification_site: site.id_classification_site                 
                });
                console.log(datas);
                //factory
            apiFactory.add("site/index",datas, config).success(function (data)
            {
               
                var ecol = vm.allecole.filter(function(obj)
                {
                    return obj.id == site.id_ecole;
                });
                var agen = vm.allagence_acc.filter(function(obj)
                {
                    return obj.id == site.id_agence_acc;
                });
                var cla = vm.allclassification_site.filter(function(obj)
                {
                    return obj.id == site.id_classification_site;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.classification_site   = cla[0];
                        vm.selectedItem.agence_acc   = agen[0];
                        vm.selectedItem.ecole   = ecol[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allsite = vm.allsite.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  site.classification_site = cla[0];
                  site.ecole = ecol[0];
                  site.agence_acc   = agen[0];
                  site.id        =   String(data.response);              
                  NouvelItem = false;
            }
              site.$selected = false;
              site.$edit = false;
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
        vm.affichestatuconvention = function(item)
        {
          var x = Number(item);
          switch(x)
          {
              case 1:
              {
                  return "En cours de traitement";
                  break;
              }

              case 2:
              {
                  return "Signé";
                  break;
              }

              default:
              {
                  return "Preparation";
                  break;
              }
          }
        }
        vm.affichelot = function(item)
        {
          var x = Number(item);
          switch(x)
          {
              case 1:
              {
                  return "Lot 1";
                  break;
              }

              case 2:
              {
                  return "Lot 2";
                  break;
              }

              case 3:
              {
                  return "Lot 3";
                  break;
              }

              default:
              {
                  return "Lot 4";
                  break;
              }
          }
        }
    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
