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

        vm.ajoutBatiment_construction = ajoutBatiment_construction ;
        vm.selectedItemBatiment_construction = {} ;
        vm.allbatiment_construction  = [] ;
        var currentItemBatiment_construction;

        //vm.ajoutAvenant_prestataire = ajoutAvenant_prestataire ;
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

/*****************debut batiment construction***************/
      //col table
        vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"cout maitrise oeuvre"
        },
        {
          titre:"Cout batiment"
        },
        {
          titre:"Cout sous projet"
        },
        {
          titre:"Attachement"
        },
        {
          titre:"Ponderation"
        },
        {
          titre:"Action"
        }];

        //recuperation donnée batiment ouvrage
        apiFactory.getAll("batiment_ouvrage/index").then(function(result)
        {
          vm.allbatiment_ouvrage= result.data.response;
        });


        //fonction ajout dans bdd
        function ajoutBatiment_construction(batiment_construction,suppression)
        {
          test_existanceBatiment_construction (batiment_construction,suppression); 
            
        }

        //fonction de bouton d'annulation batiment_construction
        vm.annulerBatiment_construction = function(item)
        {
              item.$edit = false;
              item.$selected = false;
              item.id_batiment_ouvrage = currentItemBatiment_construction.id_batiment_ouvrage;
              item.cout_maitrise_oeuvre    = currentItemBatiment_construction.cout_maitrise_oeuvre;
              item.cout_sous_projet = currentItemBatiment_construction.cout_sous_projet;
              item.cout_batiment = currentItemBatiment_construction.cout_batiment;
              item.ponderation_batiment = currentItemBatiment_construction.ponderation_batiment;
              item.id_attachement_batiment    = currentItemBatiment_construction.id_attachement_batiment; 
        
          vm.selectedItemBatiment_construction = {} ;
          
        };

        //fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;
            currentItemBatiment_construction     = JSON.parse(JSON.stringify(vm.selectedItemBatiment_construction));
           // vm.allconvention= [] ;            
            //recuperation donnée convention
            if (vm.selectedItemBatiment_construction.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                  
              });

              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  
              });
              vm.stepThree = true;
              vm.stepFor = false;
            }           

        };
        $scope.$watch('vm.selectedItemBatiment_construction', function()
        {
             if (!vm.allbatiment_construction) return;
             vm.allbatiment_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBatiment_construction.$selected = true;
        });

        //fonction masque de saisie modification item batiment construction
        vm.modifierBatiment_construction = function(item)
        {
            //NouvelItemBatiment_construction = false ;
            vm.selectedItemBatiment_construction = item;
            currentItemBatiment_construction = angular.copy(vm.selectedItemBatiment_construction);
            $scope.vm.allbatiment_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
             
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_batiment/index","id_batiment_ouvrage",item.batiment_ouvrage.id).then(function(result)
            {
              vm.allattachement_batiment= result.data.response;
              item.id_attachement_batiment = vm.selectedItemBatiment_construction.attachement_batiment.id;
            });

           item.ponderation_batiment = parseInt(vm.selectedItemBatiment_construction.attachement_batiment.ponderation_batiment);
            

            
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceBatiment_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var ouv_c = vm.allbatiment_construction.filter(function(obj)
                {
                   return obj.id == currentItemBatiment_construction.id;
                });
                if(ouv_c[0])
                {
                   if((ouv_c[0].id_attachement_batiment!=currentItemBatiment_construction.id_attachement_batiment))                    
                      { 
                        insert_in_baseBatiment_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseBatiment_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseBatiment_construction(batiment_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        vm.selectedItemBatiment_construction.id,
                    id_batiment_ouvrage: batiment_construction.batiment_ouvrage.id,
                    id_attachement_batiment: batiment_construction.id_attachement_batiment,
                    id_convention_detail: vm.selectedItemConvention_detail.id

                });
                console.log(datas);
                //factory
            apiFactory.add("batiment_construction/index",datas, config).success(function (data)
            {
                var atta_b = vm.allattachement_batiment.filter(function(obj)
                {
                    return obj.id == batiment_construction.id_attachement_batiment;
                });
                // Update: id exclu
                vm.selectedItemBatiment_construction.attachement_batiment   = atta_b[0];
                vm.selectedItemBatiment_construction.$selected  = false;
                vm.selectedItemBatiment_construction.$edit      = false;
                vm.selectedItemBatiment_construction ={};
               
              batiment_construction.$selected = false;
              batiment_construction.$edit = false;
              vm.selectedItemBatiment_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.modification_attachement_batiment = function(item)
        {
          var atta = vm.allattachement_batiment.filter(function(obj)
            {
                return obj.id == item.id_attachement_batiment;
            });

            item.ponderation_batiment = parseInt(atta[0].ponderation_batiment);
        }

        

      /*****************fin batiment construction***************/
      
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
