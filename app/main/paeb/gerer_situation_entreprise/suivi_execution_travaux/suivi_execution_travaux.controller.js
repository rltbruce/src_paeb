(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_execution_travaux')
        .controller('Suivi_execution_travauxController', Suivi_execution_travauxController);
    /** @ngInject */
    function Suivi_execution_travauxController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        //vm.ajoutContrat_prestataire = ajoutContrat_prestataire ;
        //var NouvelItemContrat_prestataire=false;
        //var currentItemContrat_prestataire;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.selectedItemConvention_detail = {} ;
        vm.allconvention_detail = [] ;

        vm.ajoutAvenant_prestataire = ajoutAvenant_prestataire ;
        var NouvelItemAvenant_prestataire=false;
        var currentItemAvenant_prestataire;
        vm.selectedItemAvenant_prestataire = {} ;
        vm.allavenant_prestataire = [] ;

        vm.allprestataire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.showbuttonNouvContrat_prestataire=true;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
 
/**********************************fin contrat prestataire****************************************/
        //col table
        vm.contrat_prestataire_column = [
        {titre:"Prestataire"
        },
        {titre:"Description"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        },
        {titre:"Date prévisionnelle"
        },
        {titre:"Date réel"
        },
        {titre:"Délai éxecution"
        },
        {titre:"Action"
        }];     
        //recuperation donnée convention
        apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           // vm.allconvention= [] ;
            
            //vm.showbuttonNouvContrat_prestataire=true;
            //recuperation donnée convention
            if (item.id!=0)
            {
              apiFactory.getOne("convention_cisco_feffi_entete/index",item.convention_entete.id).then(function(result)
              {
                  vm.allconvention_entete = result.data.response;
                  console.log(vm.allconvention_entete);
                  /*if (vm.allcontrat_prestataire.length!=0)
                  {
                    vm.showbuttonNouvContrat_prestataire=false;
                  }*/
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemContrat_prestataire', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allcontrat_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_prestataire.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

/**********************************debut convention entete****************************************/
//col table
  vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Numero convention"
        },
        {titre:"Objet"
        },
        {titre:"Date signature"
        },
        {titre:"Financement"
        },
        {titre:"Delai"
        }];
 
        //fonction selection item region
        vm.selectionConvention_entete= function (item)
        {
            vm.selectedItemConvention_entete = item;
            vm.nouvelItemConvention_entete   = item;
            //currentItemConvention_entete    = JSON.parse(JSON.stringify(vm.selectedItemConvention_entete));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.allconvention_detail = result.data.response;
                  
                  console.log(vm.allconvention_detail);
              });

            vm.stepTwo = true;
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

/**********************************debut convention_detail**************************************/
 //col table
        vm.convention_detail_column = [
        {
          titre:"Intitule"
        },
        {
          titre:"Zone subvention"
        },
        {
          titre:"Acces zone"
        },
        {
          titre:"Cout éstimé"
        }];

        vm.selectionConvention_detail = function (item)
        {
            vm.selectedItemConvention_detail = item;
           // vm.allconvention= [] ;
            
            //vm.showbuttonNouvConvention_detail=true;
            //recuperation donnée convention
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_detail',item.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response; 
                  console.log(vm.allbatiment_construction);
              });
              vm.stepThree = true;
              vm.stepFor = false;
            }           

        };
        $scope.$watch('vm.selectedItemConvention_detail', function()
        {
             if (!vm.allconvention_detail) return;
             vm.allconvention_detail.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_detail.$selected = true;
        });

/**********************************fin convention_detail****************************************/

/**********************************debut avenant_prestataire****************************************/

//col table
        vm.avenant_prestataire_column = [
        {titre:"Description"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvenant_prestataire = function ()
        { 
          if (NouvelItemAvenant_prestataire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              num_contrat: '',
              cout_batiment: 0,
              cout_latrine: 0,
              cout_mobilier:0,
              date_signature:'',
            };         
            vm.allavenant_prestataire.push(items);
            vm.allavenant_prestataire.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_prestataire = mem;
              }
            });

            NouvelItemAvenant_prestataire = true ;
          }else
          {
            vm.showAlert('Ajout avenant_prestataire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_prestataire(avenant_prestataire,suppression)
        {
            if (NouvelItemAvenant_prestataire==false)
            {
                test_existanceAvenant_prestataire (avenant_prestataire,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_prestataire(avenant_prestataire,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_prestataire
        vm.annulerAvenant_prestataire = function(item)
        {
          if (NouvelItemAvenant_prestataire == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvenant_prestataire.description ;
            item.num_contrat   = currentItemAvenant_prestataire.num_contrat ;
            item.cout_batiment   = currentItemAvenant_prestataire.cout_batiment ;
            item.cout_latrine = currentItemAvenant_prestataire.cout_latrine ;
            item.cout_mobilier = currentItemAvenant_prestataire.cout_mobilier;
            item.date_signature = currentItemAvenant_prestataire.date_signature ;
          }else
          {
            vm.allavenant_prestataire = vm.allavenant_prestataire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_prestataire.id;
            });
          }

          vm.selectedItemAvenant_prestataire = {} ;
          NouvelItemAvenant_prestataire      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_prestataire= function (item)
        {
            vm.selectedItemAvenant_prestataire = item;
            vm.nouvelItemAvenant_prestataire   = item;
            currentItemAvenant_prestataire    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_prestataire)); 
        };
        $scope.$watch('vm.selectedItemAvenant_prestataire', function()
        {
             if (!vm.allavenant_prestataire) return;
             vm.allavenant_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_prestataire.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_prestataire = function(item)
        {
            NouvelItemAvenant_prestataire = false ;
            vm.selectedItemAvenant_prestataire = item;
            currentItemAvenant_prestataire = angular.copy(vm.selectedItemAvenant_prestataire);
            $scope.vm.allavenant_prestataire.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemAvenant_prestataire.description ;
            item.num_contrat   = vm.selectedItemAvenant_prestataire.num_contrat ;
            item.cout_batiment   = vm.selectedItemAvenant_prestataire.cout_batiment ;
            item.cout_latrine = vm.selectedItemAvenant_prestataire.cout_latrine;
            item.cout_mobilier = vm.selectedItemAvenant_prestataire.cout_mobilier;
            item.date_signature = vm.selectedItemAvenant_prestataire.date_signature ;
        };

        //fonction bouton suppression item Avenant_prestataire
        vm.supprimerAvenant_prestataire = function()
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
                vm.ajoutAvenant_prestataire(vm.selectedItemAvenant_prestataire,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_prestataire (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_prestataire.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_prestataire.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_prestataire.description )
                    || (pass[0].num_contrat  != currentItemAvenant_prestataire.num_contrat)
                    || (pass[0].cout_batiment   != currentItemAvenant_prestataire.cout_batiment )
                    || (pass[0].cout_latrine != currentItemAvenant_prestataire.cout_latrine )
                    || (pass[0].cout_mobilier != currentItemAvenant_prestataire.cout_mobilier)
                    || (pass[0].date_signature != currentItemAvenant_prestataire.date_signature ))                   
                      { 
                         insert_in_baseAvenant_prestataire(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_prestataire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_prestataire(avenant_prestataire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_prestataire==false)
            {
                getId = vm.selectedItemAvenant_prestataire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avenant_prestataire.description,
                    num_contrat: avenant_prestataire.num_contrat,
                    cout_batiment: avenant_prestataire.cout_batiment,
                    cout_latrine: avenant_prestataire.cout_latrine,
                    cout_mobilier:avenant_prestataire.cout_mobilier,
                    date_signature:convertionDate(new Date(avenant_prestataire.date_signature)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_prestataire/index",datas, config).success(function (data)
            {   
                var press= vm.allprestataire.filter(function(obj)
                {
                    return obj.id == avenant_prestataire.id_prestataire;
                });

                if (NouvelItemAvenant_prestataire == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvenant_prestataire.prestataire = press[0];

                        vm.selectedItemAvenant_prestataire.description   = avenant_prestataire.description ;
                        vm.selectedItemAvenant_prestataire.num_contrat   = avenant_prestataire.num_contrat ;
                        vm.selectedItemAvenant_prestataire.cout_batiment   = avenant_prestataire.cout_batiment ;
                        vm.selectedItemAvenant_prestataire.cout_mobilier = avenant_prestataire.cout_mobilier ;
                        vm.selectedItemAvenant_prestataire.cout_latrine = avenant_prestataire.cout_latrine;
                        vm.selectedItemAvenant_prestataire.date_signature = avenant_prestataire.date_signature ;
                        
                        vm.selectedItemAvenant_prestataire.$selected  = false;
                        vm.selectedItemAvenant_prestataire.$edit      = false;
                        vm.selectedItemAvenant_prestataire ={};
                    }
                    else 
                    {    
                      vm.allavenant_prestataire = vm.allavenant_prestataire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_prestataire.id;
                      });
                    }
                }
                else
                {
                  avenant_prestataire.prestataire = press[0];

                  avenant_prestataire.description   = avenant_prestataire.description ;
                  avenant_prestataire.cout_batiment   = avenant_prestataire.cout_batiment ;
                  avenant_prestataire.cout_latrine   = avenant_prestataire.cout_latrine ;
                  avenant_prestataire.cout_mobilier = avenant_prestataire.cout_mobilier ;
                  avenant_prestataire.date_signature = avenant_prestataire.date_signature; 

                  avenant_prestataire.id  =   String(data.response);              
                  NouvelItemAvenant_prestataire=false;
                }
              avenant_prestataire.$selected = false;
              avenant_prestataire.$edit = false;
              vm.selectedItemAvenant_prestataire = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

       /* vm.changePrestataire = function(item)
        {
          var pre = vm.allprestataire.filter(function(obj)
          {
              return obj.id == item.id_prestataire;
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
