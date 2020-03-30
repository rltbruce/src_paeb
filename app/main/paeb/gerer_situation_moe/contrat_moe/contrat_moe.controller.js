(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.contrat_moe')
        .controller('Contrat_moeController', Contrat_moeController);
    /** @ngInject */
    function Contrat_moeController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
        var vm = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        vm.ajoutContrat_moe = ajoutContrat_moe ;
        var NouvelItemContrat_moe=false;
        var currentItemContrat_moe;
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

        vm.ajoutAvenant_moe = ajoutAvenant_moe ;
        var NouvelItemAvenant_moe=false;
        var currentItemAvenant_moe;
        vm.selectedItemAvenant_moe = {} ;
        vm.allavenant_moe = [] ;

        vm.allmoe = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.showbuttonNouvContrat_moe=true;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

        //col table
        vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        }];

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention_entete = result.data.response; 
                console.log(vm.allconvention_entete);
            });
          }
          

        });
 
/**********************************fin convention entete****************************************/       
        //recuperation donnée convention
       /* apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention_entete = result.data.response; 
            console.log(vm.allconvention_entete);
        });*/

        //recuperation donnée moe
        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allmoe= result.data.response;
            console.log(vm.allmoe);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_moe=true;
            //recuperation donnée convention
            if (vm.selectedItemConvention_entete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allcontrat_moe = result.data.response;

                  if (vm.allcontrat_moe.length!=0)
                  {
                    vm.showbuttonNouvContrat_moe=false;
                  }
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
        });        

/**********************************fin convention entete****************************************/

/**********************************debut passation_marches****************************************/
//col table
        vm.contrat_moe_column = [
        {titre:"Bureau d'etude"
        },
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterContrat_moe = function ()
        { 
          if (NouvelItemContrat_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              ref_contrat: '',
              montant_contrat: 0,
              id_moe:''
            };         
            vm.allcontrat_moe.push(items);
            vm.allcontrat_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemContrat_moe = mem;
              }
            });

            NouvelItemContrat_moe = true ;
          }else
          {
            vm.showAlert('Ajout contrat_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutContrat_moe(contrat_moe,suppression)
        {
            if (NouvelItemContrat_moe==false)
            {
                test_existanceContrat_moe (contrat_moe,suppression); 
            } 
            else
            {
                insert_in_baseContrat_moe(contrat_moe,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_moe
        vm.annulerContrat_moe = function(item)
        {
          if (NouvelItemContrat_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemContrat_moe.intitule ;
            item.ref_contrat   = currentItemContrat_moe.ref_contrat ;
            item.montant_contrat   = currentItemContrat_moe.montant_contrat ;            
            item.date_signature = currentItemContrat_moe.date_signature ;            
            item.id_moe = currentItemContrat_moe.id_moe ;
          }else
          {
            vm.allcontrat_moe = vm.allcontrat_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemContrat_moe.id;
            });
          }

          vm.selectedItemContrat_moe = {} ;
          NouvelItemContrat_moe      = false;
          
        };

        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;
            vm.nouvelItemContrat_moe   = item;
            currentItemContrat_moe    = JSON.parse(JSON.stringify(vm.selectedItemContrat_moe));

           if(item.id!=0)
           {
            vm.stepTwo = true;
            vm.stepThree = false;
            apiFactory.getAPIgeneraliserREST("avenant_be/index",'menus','getavenanttBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  vm.allavenant_moe = result.data.response;
              });
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_moe', function()
        {
             if (!vm.allcontrat_moe) return;
             vm.allcontrat_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierContrat_moe = function(item)
        {
            NouvelItemContrat_moe = false ;
            vm.selectedItemContrat_moe = item;
            currentItemContrat_moe = angular.copy(vm.selectedItemContrat_moe);
            $scope.vm.allcontrat_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemContrat_moe.intitule ;
            item.ref_contrat   = vm.selectedItemContrat_moe.ref_contrat ;
            item.montant_contrat   = parseInt(vm.selectedItemContrat_moe.montant_contrat);           
            item.date_signature = new Date(vm.selectedItemContrat_moe.date_signature) ;           
            item.id_moe = vm.selectedItemContrat_moe.moe.id ;
        };

        //fonction bouton suppression item Contrat_moe
        vm.supprimerContrat_moe = function()
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
                vm.ajoutContrat_moe(vm.selectedItemContrat_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Contrat_moe
        function test_existanceContrat_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allcontrat_moe.filter(function(obj)
                {
                   return obj.id == currentItemContrat_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].intitule   != currentItemContrat_moe.intitule )
                    || (pass[0].ref_contrat  != currentItemContrat_moe.ref_contrat)
                    || (pass[0].montant_contrat   != currentItemContrat_moe.montant_contrat )                    
                    || (pass[0].date_signature != currentItemContrat_moe.date_signature )                   
                    || (pass[0].id_moe != currentItemContrat_moe.id_moe ))                   
                      { 
                         insert_in_baseContrat_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseContrat_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseContrat_moe(contrat_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemContrat_moe==false)
            {
                getId = vm.selectedItemContrat_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: contrat_moe.intitule,
                    ref_contrat: contrat_moe.ref_contrat,
                    montant_contrat: contrat_moe.montant_contrat,
                    date_signature:convertionDate(new Date(contrat_moe.date_signature)),
                    id_bureau_etude:contrat_moe.id_moe,
                    id_convention_entete: vm.selectedItemConvention_entete.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_be/index",datas, config).success(function (data)
            {   
                var pres= vm.allmoe.filter(function(obj)
                {
                    return obj.id == contrat_moe.id_moe;
                });

                if (NouvelItemContrat_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemContrat_moe.bureau_etude = pres[0];
                        
                        vm.selectedItemContrat_moe.$selected  = false;
                        vm.selectedItemContrat_moe.$edit      = false;
                        vm.selectedItemContrat_moe ={};
                        vm.showbuttonNouvContrat_moe= false;
                    }
                    else 
                    {    
                      vm.allcontrat_moe = vm.allcontrat_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemContrat_moe.id;
                      });
                      vm.showbuttonNouvContrat_moe= true;
                    }
                    
                }
                else
                {
                  contrat_moe.bureau_etude = pres[0];

                  contrat_moe.id  =   String(data.response);              
                  NouvelItemContrat_moe=false;
                  vm.showbuttonNouvContrat_moe= false;
            }
              contrat_moe.$selected = false;
              contrat_moe.$edit = false;
              vm.selectedItemContrat_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin contrat_moe****************************************/

/**********************************fin avenant_moe****************************************/

//col table
        vm.avenant_moe_column = [
        {titre:"intitule"
        },
        {titre:"Reference avenant"
        },
        {titre:"Montant avenant"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvenant_moe = function ()
        { 
          if (NouvelItemAvenant_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              ref_avenant: '',
              montant_avenant: 0,
              date_signature:'',
            };         
            vm.allavenant_moe.push(items);
            vm.allavenant_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_moe = mem;
              }
            });

            NouvelItemAvenant_moe = true ;
          }else
          {
            vm.showAlert('Ajout avenant_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_moe(avenant_moe,suppression)
        {
            if (NouvelItemAvenant_moe==false)
            {
                test_existanceAvenant_moe (avenant_moe,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_moe(avenant_moe,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_moe
        vm.annulerAvenant_moe = function(item)
        {
          if (NouvelItemAvenant_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvenant_moe.intitule ;
            item.ref_avenant   = currentItemAvenant_moe.ref_avenant ;
            item.montant_avenant   = currentItemAvenant_moe.montant_avenant ;
            item.date_signature = currentItemAvenant_moe.date_signature ;
          }else
          {
            vm.allavenant_moe = vm.allavenant_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_moe.id;
            });
          }

          vm.selectedItemAvenant_moe = {} ;
          NouvelItemAvenant_moe      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_moe= function (item)
        {
            vm.selectedItemAvenant_moe = item;
            vm.nouvelItemAvenant_moe   = item;
            currentItemAvenant_moe    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_moe)); 
        };
        $scope.$watch('vm.selectedItemAvenant_moe', function()
        {
             if (!vm.allavenant_moe) return;
             vm.allavenant_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_moe = function(item)
        {
            NouvelItemAvenant_moe = false ;
            vm.selectedItemAvenant_moe = item;
            currentItemAvenant_moe = angular.copy(vm.selectedItemAvenant_moe);
            $scope.vm.allavenant_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvenant_moe.intitule ;
            item.ref_avenant   = vm.selectedItemAvenant_moe.ref_avenant ;
            item.montant_avenant   = vm.selectedItemAvenant_moe.montant_avenant ;
            item.date_signature = new Date(vm.selectedItemAvenant_moe.date_signature) ;
        };

        //fonction bouton suppression item Avenant_moe
        vm.supprimerAvenant_moe = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutAvenant_moe(vm.selectedItemAvenant_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_moe.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].intitule   != currentItemAvenant_moe.intitule )
                    || (pass[0].ref_avenant  != currentItemAvenant_moe.ref_avenant)
                    || (pass[0].montant_avenant   != currentItemAvenant_moe.montant_avenant )
                    || (pass[0].date_signature != currentItemAvenant_moe.date_signature ))                   
                      { 
                         insert_in_baseAvenant_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_moe(avenant_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_moe==false)
            {
                getId = vm.selectedItemAvenant_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avenant_moe.intitule,
                    ref_avenant: avenant_moe.ref_avenant,
                    montant_avenant: avenant_moe.montant_avenant,
                    date_signature:convertionDate(new Date(avenant_moe.date_signature)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_be/index",datas, config).success(function (data)
            {   
                var press= vm.allmoe.filter(function(obj)
                {
                    return obj.id == avenant_moe.id_moe;
                });

                if (NouvelItemAvenant_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvenant_moe.moe = press[0];
                        vm.selectedItemAvenant_moe.$selected  = false;
                        vm.selectedItemAvenant_moe.$edit      = false;
                        vm.selectedItemAvenant_moe ={};
                    }
                    else 
                    {    
                      vm.allavenant_moe = vm.allavenant_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_moe.id;
                      });
                    }
                }
                else
                {
                  avenant_moe.moe = press[0];
                  avenant_moe.id  =   String(data.response);              
                  NouvelItemAvenant_moe=false;
                }
              avenant_moe.$selected = false;
              avenant_moe.$edit = false;
              vm.selectedItemAvenant_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

       /* vm.changemoe = function(item)
        {
          var pre = vm.allmoe.filter(function(obj)
          {
              return obj.id == item.id_moe;
          });
         // console.log(pre[0]);
          item.telephone=pre[0].telephone;
          item.siege=pre[0].siege;
        }*/
/**********************************fin mpe_sousmissionnaire****************************************/
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

        function convertionDate(daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

      vm.affichageDate = function (daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= jour+"/"+mois+"/"+annee;
                return date_final
            }      
        }
        

    }
})();
