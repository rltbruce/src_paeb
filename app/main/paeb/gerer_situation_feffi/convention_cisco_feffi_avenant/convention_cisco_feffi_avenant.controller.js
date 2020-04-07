(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi_avenant')
        .controller('Convention_cisco_feffi_avenantController', Convention_cisco_feffi_avenantController);
    /** @ngInject */
    function Convention_cisco_feffi_avenantController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
    
        var vm    = this;
        var NouvelItemTete = false;
        var currentItemTete;

        vm.date_now         = new Date();
        vm.selectedItemTete = {} ;

        vm.selectedItemTete.$selected=false;
        vm.allconvention_cife_tete  = [] ;

        vm.stepOne           = false;
        vm.stepTwo           = false;

        vm.ajoutAvenant_convention = ajoutAvenant_convention ;
        var NouvelItemAvenant_convention=false;
        var currentItemAvenant_convention;
        vm.selectedItemAvenant_convention = {} ;
        vm.allavenant_convention = [] ;

        vm.showbuttonNouvAvenant=true;

        vm.afficherboutonValider = false;
        vm.permissionboutonValider = false;
        //vm.usercisco = [];
      /*****fin initialisation*****/

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        
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
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideByciscowithcount','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention_cife_tete = result.data.response; 
                console.log(vm.allconvention_cife_tete);
            });
          }
          

        });

        vm.formatMillier = function (nombre) 
        {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
        }
        vm.staredItem = function(item)
        {  
          var stared = false;
          if(parseInt(item.countAvenant.nbr)>0)
          {
            stared = true;
          }

          return stared;

        }
      /*****************debut convention entete***************/

        //col table
        vm.convention_cife_tete_column = [
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

        //fonction selection item entete convention cisco/feffi
        vm.selectionTete = function (item)
        {
            vm.selectedItemTete = item;
            if(item.$selected==false)
            {
              currentItemTete     = JSON.parse(JSON.stringify(vm.selectedItemTete));
            }            
            
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvAvenant=true;
            //recuperation donnée convention
           if (vm.selectedItemTete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu','getavenantinvalideByconvention','id_convention_entete',item.id).then(function(result)
              {
                  vm.allavenant_convention = result.data.response;

                  if (vm.allavenant_convention.length!=0)
                  {
                    vm.showbuttonNouvAvenant=false;
                  } 
                  console.log(vm.selectedItemTete);
                  console.log(vm.allavenant_convention);
              });
              
              
              //Fin Récupération cout divers par convention
              vm.stepOne = true;
              vm.stepTwo = false;
            };           

        };
        $scope.$watch('vm.selectedItemTete', function()
        {
             if (!vm.allconvention_cife_tete) return;
             vm.allconvention_cife_tete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTete.$selected = true;
        });
      
      /*****************fin convention entete***************/

      
 /**********************************fin avenant_prestataire****************************************/

//col table
        vm.avenant_convention_column = [
        {titre:"Description"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvenant_convention = function ()
        { 
          if (NouvelItemAvenant_convention == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              montant: 0,
              date_signature:'',
            };         
            vm.allavenant_convention.push(items);
            vm.allavenant_convention.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_convention = mem;
              }
            });

            NouvelItemAvenant_convention = true ;
          }else
          {
            vm.showAlert('Ajout avenant_convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_convention(avenant_convention,suppression)
        {
            if (NouvelItemAvenant_convention==false)
            {
                test_existanceAvenant_convention (avenant_convention,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_convention(avenant_convention,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_convention
        vm.annulerAvenant_convention = function(item)
        {
          if (NouvelItemAvenant_convention == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvenant_convention.description ;
            item.montant   = currentItemAvenant_convention.montant ;
            item.date_signature = currentItemAvenant_convention.date_signature ;
          }else
          {
            vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_convention.id;
            });
            vm.showbuttonNouvAvenant=true;
          }

          vm.selectedItemAvenant_convention = {} ;
          NouvelItemAvenant_convention      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_convention= function (item)
        {
            vm.selectedItemAvenant_convention = item;
            vm.nouvelItemAvenant_convention   = item;
            currentItemAvenant_convention    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_convention)); 
            vm.afficherboutonValider = true;
        };
        $scope.$watch('vm.selectedItemAvenant_convention', function()
        {
             if (!vm.allavenant_convention) return;
             vm.allavenant_convention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_convention.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_convention = function(item)
        {
            NouvelItemAvenant_convention = false ;
            vm.selectedItemAvenant_convention = item;
            currentItemAvenant_convention = angular.copy(vm.selectedItemAvenant_convention);
            $scope.vm.allavenant_convention.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemAvenant_convention.description ;
            item.montant   = vm.selectedItemAvenant_convention.montant ;
            item.date_signature = vm.selectedItemAvenant_convention.date_signature ;

            vm.afficherboutonValider = false;
        };

        //fonction bouton suppression item Avenant_convention
        vm.supprimerAvenant_convention = function()
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
                vm.ajoutAvenant_convention(vm.selectedItemAvenant_convention,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_convention (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_convention.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_convention.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_convention.description )
                    || (pass[0].montant  != currentItemAvenant_convention.montant)
                    || (pass[0].date_signature != currentItemAvenant_convention.date_signature ))                   
                      { 
                         insert_in_baseAvenant_convention(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_convention(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_convention(avenant_convention,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_convention==false)
            {
                getId = vm.selectedItemAvenant_convention.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avenant_convention.description,
                    montant: avenant_convention.montant,
                    date_signature:convertionDate(new Date(avenant_convention.date_signature)),
                    id_convention_entete: vm.selectedItemTete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_convention/index",datas, config).success(function (data)
            {   
                var conve= vm.allconvention_cife_tete.filter(function(obj)
                {
                    return obj.id == avenant_convention.id_convention;
                });

                if (NouvelItemAvenant_convention == false)
                {
                    // Update or delete: id exclu                 
                    if(supconveion==0)
                    {                        
                        vm.selectedItemAvenant_convention.convention = conve[0];
                        
                        vm.selectedItemAvenant_convention.$selected  = false;
                        vm.selectedItemAvenant_convention.$edit      = false;
                        vm.selectedItemAvenant_convention ={};
                    }
                    else 
                    {    
                      vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_convention.id;
                      });
                      vm.showbuttonNouvAvenant=true;

                    
                    }
                }
                else
                {
                  avenant_convention.convention = conve[0];

                  avenant_convention.id  =   String(data.response);              
                  NouvelItemAvenant_convention=false;
                  vm.showbuttonNouvAvenant=false;
                }
              avenant_convention.$selected = false;
              avenant_convention.$edit = false;
              vm.selectedItemAvenant_convention = {};
              vm.afficherboutonValider = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerAvenant = function()
        {
          valideravenantinbase(vm.selectedItemAvenant_convention,0,1);
        }
        function valideravenantinbase(avenant_convention,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avenant_convention.id,
                    description: avenant_convention.description,
                    montant: avenant_convention.montant,
                    date_signature:convertionDate(new Date(avenant_convention.date_signature)),
                    date_signature:convertionDate(new Date(avenant_convention.date_signature)),
                    id_convention_entete: avenant_convention.convention_entete.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_convention/index",datas, config).success(function (data)
            {   
                vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemAvenant_convention.id;
                });
              avenant_convention.$selected = false;
              avenant_convention.$edit = false;
              vm.selectedItemAvenant_convention = {};
              vm.afficherboutonValider = false;
              vm.selectedItemTete.countAvenant = parseInt(vm.selectedItemTete.countAvenant)-1;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
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

        //format date affichage sur datatable
        vm.formatDate = function (daty)
        {
          if (daty) 
          {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

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
