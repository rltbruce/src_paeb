(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.site')
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
        vm.regions =[];
        vm.ciscos =[];
        vm.communes =[];
        vm.zaps =[];
        vm.ecoles =[];

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearch   = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.match = true;
        vm.affiche_load =true;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false ,
          order : [],
          /*scrollX: false,
          columnDefs: [
            {  Width: 200, targets: [0, 1] }
          ]*/        
        };

         

        vm.showformfiltre = function()
        {
          //vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
        //col table
        vm.site_column = [
        {titre:"Region"
        },
        {titre:"CISCO"
        },
        {titre:"Commune"
        },
        {titre:"ZAP"
        },
        {titre:"EPP"
        },
        {titre:"Accés"
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
      /*  apiFactory.getAPIgeneraliserREST("site/index",'menu',
         'getsiteByenpreparationandinvalide').then(function(result)
        {
          vm.allsite = result.data.response;

          vm.affiche_load =false;
        });*/
        var id_user = $cookieStore.get('id');
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
            vm.user = result.data.response;

            if (vm.user.roles.indexOf("AAC")!= -1)
            { 
               vm.session='AAC';                  
            }

            if (vm.user.roles.indexOf("ADMIN")!= -1)
            {
                vm.session='ADMIN';
            }

            
        });

        apiFactory.getAll("classification_site/index").then(function(result)
        {
            vm.allclassification_site = result.data.response;
        });


        apiFactory.getAll("agence_acc/index").then(function(result)
        {
          vm.allagence_acc= result.data.response;
        });
        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
          vm.affiche_load =false;
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

         vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                });
            }
            else
            {
                vm.ciscos = [];
            }
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
              });
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index","menu","getzapBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.filtre_change_zap = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.ecoles = result.data.response;
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }

        vm.recherchefiltre = function(filtre)
        {   

            vm.affiche_load =true;
            if (vm.session=='AAC')
            {
              apiFactory.getAPIgeneraliserREST("site/index",'menu',
              'getsiteByenpreparationandinvalide','lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
              filtre.id_cisco,'id_commune',filtre.id_commune,'id_zap',filtre.id_zap,'id_ecole',filtre.id_ecole).then(function(result)
              {
                  vm.allsite = result.data.response;
                  console.log(vm.allsite);
                  vm.affiche_load =false;
              });
            }
            else
            {
              /*apiFactory.getAPIgeneraliserREST("site/index",'menu',
              'getsiteByfiltre','lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
              filtre.id_cisco,'id_commune',filtre.id_commune,'id_zap',filtre.id_zap,'id_ecole',filtre.id_ecole).then(function(result)
              {
                  vm.allsite = result.data.response;
                  vm.affiche_load =false;
              });*/
              apiFactory.getAPIgeneraliserREST("site/index",'menu',
              'getsiteByenpreparationandinvalide','lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
              filtre.id_cisco,'id_commune',filtre.id_commune,'id_zap',filtre.id_zap,'id_ecole',filtre.id_ecole).then(function(result)
              {
                  vm.allsite = result.data.response;
                  console.log(vm.allsite);
                  vm.affiche_load =false;
              });
            }
            
        }

        vm.change_region = function(item)
        {            
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                });
            }
            else
            {
                vm.ciscos = [];
            }
          item.id_cisco = null;
        }
        vm.change_cisco = function(item)
        { item.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
              });
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.change_commune = function(item)
        { 
            item.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index",'menu',"getzapBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
                console.log(vm.zaps);
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.change_zap = function(item)
        { 
            item.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.allecole = result.data.response;
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          vm.selectedItem = {};
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
              id_region:'',
              id_cisco:'',
              id_commune:'',
              id_zap:'',
              acces:'',
              id_classification_site:'',
              lot:'',
              validation:'0'
            };         
            vm.allsite.unshift(items);
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
            {   if (vm.session=='AAC') 
                {
                    apiFactory.getAPIgeneraliserREST("site/index",'menu','testIfinvalide','id_site', site.id)
                  .then(function(result)
                  {
                    var site_valide = result.data.response;
                    console.log(site_valide);
                    if (site_valide.length!=0)
                    {
                      var confirm = $mdDialog.confirm()
                      .title('cette modification n\'est pas autorisé. Les données sont déjà validées!')
                      .textContent('')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      
                      $mdDialog.show(confirm).then(function()
                      {                      
                        vm.allsite = vm.allsite.filter(function(obj)
                        {
                            return obj.id !== site.id;
                        });
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existance (site,suppression);
                    }
                  });
                } 
                else
                {
                  test_existance (site,suppression);
                }
                
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
            item.id_region    = currentItem.id_region;
            item.id_cisco    = currentItem.id_cisco;
            item.id_commune    = currentItem.id_commune;
            item.id_zap    = currentItem.id_zap;
            item.id_ecole    = currentItem.id_ecole; 
            item.acces    = currentItem.acces;
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
            if (item.$edit==false || item.$edit==undefined)
            {
              vm.validation_item = item.validation;
              currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
              var zp = vm.zaps.filter(function(obj)
              {
                  return obj.id == item.zap.id;
              });
              if (zp.length==0)
              {                
                vm.zaps.push(item.zap);
              }
              var cm = vm.communes.filter(function(obj)
              {
                  return obj.id == item.commune.id;
              });
              if (cm.length==0)
              {
                vm.communes.push(item.commune);
              }
              var ec = vm.ecoles.filter(function(obj)
              {
                  return obj.id == item.ecole.id;
              });
              if (ec.length==0)
              {
                vm.ecoles.push(item.ecole);
              }
            }
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

            apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.region.id).then(function(result)
            {
                vm.ciscos = result.data.response;
            });
            apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.cisco.id).then(function(result)
            {
                vm.communes = result.data.response;
            });
            apiFactory.getAPIgeneraliserREST("zap_commune/index",'menu',"getzapBycommune","id_commune",item.commune.id).then(function(result)
            {
                vm.zaps = result.data.response;
            });
            apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.zap.id).then(function(result)
            {
                vm.allecole = result.data.response;
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
            item.id_region = vm.selectedItem.region.id ;
            item.id_cisco = vm.selectedItem.cisco.id ;
            item.id_commune = vm.selectedItem.commune.id ;
            item.id_zap = vm.selectedItem.zap.id ;
            item.id_ecole = vm.selectedItem.ecole.id ;
            item.acces = vm.selectedItem.acces ;
            item.id_classification_site = vm.selectedItem.classification_site.id ; 
        };

        //fonction bouton suppression item site
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
                    || (cis[0].id_region!=currentItem.id_region)
                    || (cis[0].id_commune!=currentItem.id_commune)
                    || (cis[0].id_cisco!=currentItem.id_cisco)
                    || (cis[0].id_zap!=currentItem.id_zap)
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
            var validation = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id;
                validation = vm.selectedItem.validation
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
                    id_region: site.id_region,
                    id_cisco: site.id_cisco,
                    id_commune: site.id_commune,
                    id_zap: site.id_zap,
                    id_ecole: site.id_ecole,
                    acces: site.acces,
                    id_classification_site: site.id_classification_site,
                    validation:validation                 
                });
                //factory
            apiFactory.add("site/index",datas, config).success(function (data)
            {
               
                var reg = vm.regions.filter(function(obj)
                {
                    return obj.id == site.id_region;
                });

                var cis = vm.ciscos.filter(function(obj)
                {
                    return obj.id == site.id_cisco;
                });

                var com = vm.communes.filter(function(obj)
                {
                    return obj.id == site.id_commune;
                });

                var za = vm.zaps.filter(function(obj)
                {
                    return obj.id == site.id_zap;
                });
                console.log(vm.zaps);
                console.log(site);
                console.log(za);
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
                        vm.selectedItem.region   = reg[0];
                        vm.selectedItem.cisco   = cis[0];
                        vm.selectedItem.commune   = com[0];
                        vm.selectedItem.zap   = za[0];
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
                  site.region   = reg[0];
                  site.cisco   = cis[0];
                  site.commune   = com[0];
                  site.zap   = za[0];
                  site.agence_acc   = agen[0];
                  site.id        =   String(data.response);              
                  NouvelItem = false;
            }
              site.$selected = false;
              site.$edit = false;
              vm.selectedItem = {};
              vm.showbuttonvalidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.change_ecole = function(site)
        {
          console.log(vm.allecole);
          var ecol = vm.allecole.filter(function(obj)
          {
              return obj.id == site.id_ecole;
          });
          console.log(ecol);
          if (ecol[0].zone_subvention && ecol[0].acces_zone) {
            site.acces = ecol[0].zone_subvention.libelle+ecol[0].acces_zone.libelle;
          }
          else{
            site.acces = null;
          }
          
        }

      /*  function maj_insertioninbase(site,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        site.id,      
                    code_sous_projet:      site.code_sous_projet,      
                    lot:    site.lot,      
                    observation:    site.observation,
                    id_agence_acc:   site.agence_acc.id,
                    statu_convention:    site.statu_convention,
                    objet_sous_projet: site.objet_sous_projet,
                    id_region: site.region.id,
                    id_cisco: site.cisco.id,
                    id_commune: site.commune.id,
                    id_zap: site.zap.id,
                    id_ecole: site.ecole.id,
                    acces: site.acces,
                    id_classification_site: site.classification_site.id,
                    validation:validation                 
                });
                //factory
            apiFactory.add("site/index",datas, config).success(function (data)
            {
              site.validation=1;
              site.$selected = false;
              site.$edit = false;
              vm.selectedItem = {};
              vm.showbuttonvalidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validation = function()
        {
          maj_insertioninbase(vm.selectedItem,0,1);
        }*/

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
