(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.contrat_partenaire_relai')
        .controller('Contrat_partenaire_relaiController', Contrat_partenaire_relaiController);
    /** @ngInject */
    function Contrat_partenaire_relaiController($mdDialog, $scope, apiFactory, $state)
    {
        var vm = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        vm.ajoutContrat_partenaire_relai = ajoutContrat_partenaire_relai ;
        var NouvelItemContrat_partenaire_relai=false;
        var currentItemContrat_partenaire_relai;
        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutAvenant_partenaire_relai = ajoutAvenant_partenaire_relai ;
        var NouvelItemAvenant_partenaire_relai=false;
        var currentItemAvenant_partenaire_relai;
        vm.selectedItemAvenant_partenaire_relai = {} ;
        vm.allavenant_partenaire_relai = [] ;

        vm.allpartenaire_relai = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.showbuttonNouvContrat_partenaire_relai=true;
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
 
/**********************************fin convention entete****************************************/       
        //recuperation donnée convention
        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention_entete = result.data.response; 
            console.log(vm.allconvention_entete);
        });

        //recuperation donnée partenaire_relai
        apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai= result.data.response;
            console.log(vm.allpartenaire_relai);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_partenaire_relai=true;
            //recuperation donnée convention
            if (vm.selectedItemConvention_entete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allcontrat_partenaire_relai = result.data.response;

                  if (vm.allcontrat_partenaire_relai.length!=0)
                  {
                    vm.showbuttonNouvContrat_partenaire_relai=false;
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
        vm.contrat_partenaire_relai_column = [
        {titre:"Partenaire relai"
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

        apiFactory.getAll("contrat_partenaire_relai/index").then(function(result)
        {
            vm.allcontrat_partenaire_relai = result.data.response;

        });
        //Masque de saisi ajout
        vm.ajouterContrat_partenaire_relai = function ()
        { 
          if (NouvelItemContrat_partenaire_relai == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              ref_contrat: '',
              montant_contrat: 0,
              id_partenaire_relai:''
            };         
            vm.allcontrat_partenaire_relai.push(items);
            vm.allcontrat_partenaire_relai.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemContrat_partenaire_relai = mem;
              }
            });

            NouvelItemContrat_partenaire_relai = true ;
          }else
          {
            vm.showAlert('Ajout contrat_partenaire_relai','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutContrat_partenaire_relai(contrat_partenaire_relai,suppression)
        {
            if (NouvelItemContrat_partenaire_relai==false)
            {
                test_existanceContrat_partenaire_relai (contrat_partenaire_relai,suppression); 
            } 
            else
            {
                insert_in_baseContrat_partenaire_relai(contrat_partenaire_relai,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_partenaire_relai
        vm.annulerContrat_partenaire_relai = function(item)
        {
          if (NouvelItemContrat_partenaire_relai == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemContrat_partenaire_relai.intitule ;
            item.ref_contrat   = currentItemContrat_partenaire_relai.ref_contrat ;
            item.montant_contrat   = currentItemContrat_partenaire_relai.montant_contrat ;            
            item.date_signature = currentItemContrat_partenaire_relai.date_signature ;            
            item.id_partenaire_relai = currentItemContrat_partenaire_relai.id_partenaire_relai ;
          }else
          {
            vm.allcontrat_partenaire_relai = vm.allcontrat_partenaire_relai.filter(function(obj)
            {
                return obj.id !== vm.selectedItemContrat_partenaire_relai.id;
            });
          }

          vm.selectedItemContrat_partenaire_relai = {} ;
          NouvelItemContrat_partenaire_relai      = false;
          
        };

        //fonction selection item contrat
        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;
            vm.nouvelItemContrat_partenaire_relai   = item;
            currentItemContrat_partenaire_relai    = JSON.parse(JSON.stringify(vm.selectedItemContrat_partenaire_relai));

           if(item.id!=0)
           {
            vm.stepOne = true;
            vm.stepTwo = false;
            apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allavenant_partenaire_relai = result.data.response;
              });
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_partenaire_relai', function()
        {
             if (!vm.allcontrat_partenaire_relai) return;
             vm.allcontrat_partenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_partenaire_relai.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierContrat_partenaire_relai = function(item)
        {
            NouvelItemContrat_partenaire_relai = false ;
            vm.selectedItemContrat_partenaire_relai = item;
            currentItemContrat_partenaire_relai = angular.copy(vm.selectedItemContrat_partenaire_relai);
            $scope.vm.allcontrat_partenaire_relai.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemContrat_partenaire_relai.intitule ;
            item.ref_contrat   = vm.selectedItemContrat_partenaire_relai.ref_contrat ;
            item.montant_contrat   = parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat);           
            item.date_signature = new Date(vm.selectedItemContrat_partenaire_relai.date_signature) ;           
            item.id_partenaire_relai = vm.selectedItemContrat_partenaire_relai.partenaire_relai.id ;
        };

        //fonction bouton suppression item Contrat_partenaire_relai
        vm.supprimerContrat_partenaire_relai = function()
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
                vm.ajoutContrat_partenaire_relai(vm.selectedItemContrat_partenaire_relai,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Contrat_partenaire_relai
        function test_existanceContrat_partenaire_relai (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                   return obj.id == currentItemContrat_partenaire_relai.id;
                });
                if(pass[0])
                {
                   if((pass[0].intitule   != currentItemContrat_partenaire_relai.intitule )
                    || (pass[0].ref_contrat  != currentItemContrat_partenaire_relai.ref_contrat)
                    || (pass[0].montant_contrat   != currentItemContrat_partenaire_relai.montant_contrat )                    
                    || (pass[0].date_signature != currentItemContrat_partenaire_relai.date_signature )                   
                    || (pass[0].id_partenaire_relai != currentItemContrat_partenaire_relai.id_partenaire_relai ))                   
                      { 
                         insert_in_baseContrat_partenaire_relai(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseContrat_partenaire_relai(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseContrat_partenaire_relai(contrat_partenaire_relai,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemContrat_partenaire_relai==false)
            {
                getId = vm.selectedItemContrat_partenaire_relai.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: contrat_partenaire_relai.intitule,
                    ref_contrat: contrat_partenaire_relai.ref_contrat,
                    montant_contrat: contrat_partenaire_relai.montant_contrat,
                    date_signature:convertionDate(new Date(contrat_partenaire_relai.date_signature)),
                    id_partenaire_relai:contrat_partenaire_relai.id_partenaire_relai,
                    id_convention_entete: vm.selectedItemConvention_entete.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_partenaire_relai/index",datas, config).success(function (data)
            {   
                var pres= vm.allpartenaire_relai.filter(function(obj)
                {
                    return obj.id == contrat_partenaire_relai.id_partenaire_relai;
                });

                if (NouvelItemContrat_partenaire_relai == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemContrat_partenaire_relai.intitule   = contrat_partenaire_relai.intitule ;
                        vm.selectedItemContrat_partenaire_relai.ref_contrat   = contrat_partenaire_relai.ref_contrat ;
                        vm.selectedItemContrat_partenaire_relai.montant_contrat   = contrat_partenaire_relai.montant_contrat ;
                        vm.selectedItemContrat_partenaire_relai.date_signature = contrat_partenaire_relai.date_signature ;
                        vm.selectedItemContrat_partenaire_relai.partenaire_relai = pres[0];
                        
                        vm.selectedItemContrat_partenaire_relai.$selected  = false;
                        vm.selectedItemContrat_partenaire_relai.$edit      = false;
                        vm.selectedItemContrat_partenaire_relai ={};
                        vm.showbuttonNouvContrat_partenaire_relai= false;
                    }
                    else 
                    {    
                      vm.allcontrat_partenaire_relai = vm.allcontrat_partenaire_relai.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemContrat_partenaire_relai.id;
                      });
                      vm.showbuttonNouvContrat_partenaire_relai= true;
                    }
                    
                }
                else
                {
                  contrat_partenaire_relai.intitule   = contrat_partenaire_relai.intitule ;
                  contrat_partenaire_relai.montant_contrat = contrat_partenaire_relai.montant_contrat ;
                  contrat_partenaire_relai.date_signature = contrat_partenaire_relai.date_signature;
                  contrat_partenaire_relai.partenaire_relai = pres[0];

                  contrat_partenaire_relai.id  =   String(data.response);              
                  NouvelItemContrat_partenaire_relai=false;
                  vm.showbuttonNouvContrat_partenaire_relai= false;
            }
              contrat_partenaire_relai.$selected = false;
              contrat_partenaire_relai.$edit = false;
              vm.selectedItemContrat_partenaire_relai = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin contrat_partenaire_relai****************************************/

/**********************************fin avenant_partenaire_relai****************************************/

//col table
        vm.avenant_partenaire_relai_column = [
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
        vm.ajouterAvenant_partenaire_relai = function ()
        { 
          if (NouvelItemAvenant_partenaire_relai == false)
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
            vm.allavenant_partenaire_relai.push(items);
            vm.allavenant_partenaire_relai.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_partenaire_relai = mem;
              }
            });

            NouvelItemAvenant_partenaire_relai = true ;
          }else
          {
            vm.showAlert('Ajout avenant_partenaire_relai','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_partenaire_relai(avenant_partenaire_relai,suppression)
        {
            if (NouvelItemAvenant_partenaire_relai==false)
            {
                test_existanceAvenant_partenaire_relai (avenant_partenaire_relai,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_partenaire_relai(avenant_partenaire_relai,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_partenaire_relai
        vm.annulerAvenant_partenaire_relai = function(item)
        {
          if (NouvelItemAvenant_partenaire_relai == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvenant_partenaire_relai.intitule ;
            item.ref_avenant   = currentItemAvenant_partenaire_relai.ref_avenant ;
            item.montant_avenant   = currentItemAvenant_partenaire_relai.montant_avenant ;
            item.date_signature = currentItemAvenant_partenaire_relai.date_signature ;
          }else
          {
            vm.allavenant_partenaire_relai = vm.allavenant_partenaire_relai.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_partenaire_relai.id;
            });
          }

          vm.selectedItemAvenant_partenaire_relai = {} ;
          NouvelItemAvenant_partenaire_relai      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_partenaire_relai= function (item)
        {
            vm.selectedItemAvenant_partenaire_relai = item;
            vm.nouvelItemAvenant_partenaire_relai   = item;
            currentItemAvenant_partenaire_relai    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_partenaire_relai)); 
        };
        $scope.$watch('vm.selectedItemAvenant_partenaire_relai', function()
        {
             if (!vm.allavenant_partenaire_relai) return;
             vm.allavenant_partenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_partenaire_relai.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_partenaire_relai = function(item)
        {
            NouvelItemAvenant_partenaire_relai = false ;
            vm.selectedItemAvenant_partenaire_relai = item;
            currentItemAvenant_partenaire_relai = angular.copy(vm.selectedItemAvenant_partenaire_relai);
            $scope.vm.allavenant_partenaire_relai.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvenant_partenaire_relai.intitule ;
            item.ref_avenant   = vm.selectedItemAvenant_partenaire_relai.ref_avenant ;
            item.montant_avenant   = vm.selectedItemAvenant_partenaire_relai.montant_avenant ;
            item.date_signature = new Date(vm.selectedItemAvenant_partenaire_relai.date_signature) ;
        };

        //fonction bouton suppression item Avenant_partenaire_relai
        vm.supprimerAvenant_partenaire_relai = function()
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
                vm.ajoutAvenant_partenaire_relai(vm.selectedItemAvenant_partenaire_relai,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_partenaire_relai (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_partenaire_relai.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_partenaire_relai.id;
                });
                if(pass[0])
                {
                   if((pass[0].intitule   != currentItemAvenant_partenaire_relai.intitule )
                    || (pass[0].ref_avenant  != currentItemAvenant_partenaire_relai.ref_avenant)
                    || (pass[0].montant_avenant   != currentItemAvenant_partenaire_relai.montant_avenant )
                    || (pass[0].date_signature != currentItemAvenant_partenaire_relai.date_signature ))                   
                      { 
                         insert_in_baseAvenant_partenaire_relai(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_partenaire_relai(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_partenaire_relai(avenant_partenaire_relai,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_partenaire_relai==false)
            {
                getId = vm.selectedItemAvenant_partenaire_relai.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avenant_partenaire_relai.intitule,
                    ref_avenant: avenant_partenaire_relai.ref_avenant,
                    montant_avenant: avenant_partenaire_relai.montant_avenant,
                    date_signature:convertionDate(new Date(avenant_partenaire_relai.date_signature)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_partenaire_relai/index",datas, config).success(function (data)
            {   
                var press= vm.allpartenaire_relai.filter(function(obj)
                {
                    return obj.id == avenant_partenaire_relai.id_partenaire_relai;
                });

                if (NouvelItemAvenant_partenaire_relai == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvenant_partenaire_relai.partenaire_relai = press[0];
                        vm.selectedItemAvenant_partenaire_relai.$selected  = false;
                        vm.selectedItemAvenant_partenaire_relai.$edit      = false;
                        vm.selectedItemAvenant_partenaire_relai ={};
                    }
                    else 
                    {    
                      vm.allavenant_partenaire_relai = vm.allavenant_partenaire_relai.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_partenaire_relai.id;
                      });
                    }
                }
                else
                {
                  avenant_partenaire_relai.partenaire_relai = press[0];
                  avenant_partenaire_relai.id  =   String(data.response);              
                  NouvelItemAvenant_partenaire_relai=false;
                }
              avenant_partenaire_relai.$selected = false;
              avenant_partenaire_relai.$edit = false;
              vm.selectedItemAvenant_partenaire_relai = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

       /* vm.changepartenaire_relai = function(item)
        {
          var pre = vm.allpartenaire_relai.filter(function(obj)
          {
              return obj.id == item.id_partenaire_relai;
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
