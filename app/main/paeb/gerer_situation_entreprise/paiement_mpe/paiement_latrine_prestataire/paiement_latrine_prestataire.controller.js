(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.paiement_mpe.paiement_latrine_prestataire')
        .controller('Paiement_latrine_prestataireController', Paiement_latrine_prestataireController);
    /** @ngInject */
    function Paiement_latrine_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
       /* vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;*/

        var currentItemDemande_latrine_prest;
        vm.selectedItemDemande_latrine_prest = {} ;
        vm.alldemande_latrine_prest = [] ;

        vm.allinfosupplement = [] ;

        var NouvelItemPaiement_latrine_prestataire = false;
        var currentItemPaiement_latrine_prestataire;
        vm.selectedItemPaiement_latrine_prestataire = {} ;
        vm.ajoutPaiement_latrine_prestataire  = ajoutPaiement_latrine_prestataire ;
        vm.allpaiement_latrine_prestataire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

        //col table
      /*  vm.contrat_prestataire_column = [
        {titre:"Numero contrat"
        },
        {titre:"cumul"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];*/


          apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index",'menu','getdemandeValide').then(function(result)
          {
            vm.alldemande_latrine_prest = result.data.response;
          });

/**********************************debut demande_latrine_prest****************************************/
//col table
        vm.demande_latrine_prest_column = [
        {titre:"Date approbation"
        },
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        }];

        //fonction selection item Demande_latrine_prest
        vm.selectionDemande_latrine_prest= function (item)
        {
            vm.selectedItemDemande_latrine_prest = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'id_demande_pay_pre',vm.selectedItemDemande_latrine_prest.id).then(function(result)
            {
                vm.allpaiement_latrine_prestataire = result.data.response;
                console.log(vm.allpaiement_latrine_prestataire);
            });
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratconvenBydemande_latrine','id_demande_latrine_pre',vm.selectedItemDemande_latrine_prest.id).then(function(result)
            {
                vm.allinfosupplement = result.data.response;
            });

            vm.stepOne = true;
            vm.stepTwo = false;

           }
            console.log(vm.selectedItemDemande_latrine_prest) ;
        };
        $scope.$watch('vm.selectedItemDemande_latrine_prest', function()
        {
             if (!vm.alldemande_latrine_prest) return;
             vm.alldemande_latrine_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_prest.$selected = true;
        });
/**********************************fin demande_payement_prest****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_latrine_prestataire_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_latrine_prestataire = function ()
        { 
          if (NouvelItemPaiement_latrine_prestataire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              //cumul:'',
              montant_paiement:'',
             // pourcentage_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_latrine_prestataire.push(items);
            vm.allpaiement_latrine_prestataire.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_latrine_prestataire = conv;
              }
            });

            NouvelItemPaiement_latrine_prestataire = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_latrine_prestataire(paiement_latrine_prestataire,suppression)
        {
            if (NouvelItemPaiement_latrine_prestataire==false)
            {
                test_existancePaiement_latrine_prestataire (paiement_latrine_prestataire,suppression); 
            } 
            else
            {
                insert_in_basePaiement_latrine_prestataire(paiement_latrine_prestataire,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_latrine_prestataire
        vm.annulerPaiement_latrine_prestataire = function(item)
        {
          if (NouvelItemPaiement_latrine_prestataire == false)
          {
              item.$edit = false;
              item.$selected = false;
              //item.cumul = currentItemPaiement_latrine_prestataire.cumul;
              item.montant_paiement = currentItemPaiement_latrine_prestataire.montant_paiement;
              //item.pourcentage_paiement = currentItemPaiement_latrine_prestataire.pourcentage_paiement;
              //item.id_compte_feffi = currentItemPaiement_latrine_prestataire.compte_feffi.id;
              item.observation    = currentItemPaiement_latrine_prestataire.observation;
              item.date_paiement = currentItemPaiement_latrine_prestataire.date_paiement; 
          }else
          {
            vm.allpaiement_latrine_prestataire = vm.allpaiement_latrine_prestataire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_latrine_prestataire.id;
            });
          }

          vm.selectedItemPaiement_latrine_prestataire = {} ;
          NouvelItemPaiement_latrine_prestataire      = false;
          
        };

        //fonction selection item paiement_latrine_prestataire convention cisco/feffi
        vm.selectionPaiement_latrine_prestataire = function (item)
        {
            vm.selectedItemPaiement_latrine_prestataire = item;
            currentItemPaiement_latrine_prestataire     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_latrine_prestataire));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_latrine_prestataire', function()
        {
             if (!vm.allpaiement_latrine_prestataire) return;
             vm.allpaiement_latrine_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_latrine_prestataire.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_latrine_prestataire = function(item)
        {
            NouvelItemPaiement_latrine_prestataire = false ;
            vm.selectedItemPaiement_latrine_prestataire = item;
            currentItemPaiement_latrine_prestataire = angular.copy(vm.selectedItemPaiement_latrine_prestataire);
            $scope.vm.allpaiement_latrine_prestataire.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            //item.cumul = parseInt(vm.selectedItemPaiement_latrine_prestataire.cumul) ;
            item.montant_paiement = parseInt(vm.selectedItemPaiement_latrine_prestataire.montant_paiement) ;
            //item.pourcentage_paiement = parseInt(vm.selectedItemPaiement_latrine_prestataire.pourcentage_paiement );
            item.observation = vm.selectedItemPaiement_latrine_prestataire.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_latrine_prestataire.date_paiement);
        };

        //fonction bouton suppression item paiement_latrine_prestataire convention cisco feffi
        vm.supprimerPaiement_latrine_prestataire = function()
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
                vm.ajoutPaiement_latrine_prestataire(vm.selectedItemPaiement_latrine_prestataire,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_latrine_prestataire (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_latrine_prestataire.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_latrine_prestataire.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_latrine_prestataire.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_latrine_prestataire.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_latrine_prestataire.montant_paiement))                    
                      {
                          insert_in_basePaiement_latrine_prestataire(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_latrine_prestataire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_latrine_prestataire(paiement_latrine_prestataire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_latrine_prestataire ==false)
            {
                getId = vm.selectedItemPaiement_latrine_prestataire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    //cumul:    paiement_latrine_prestataire.cumul,
                    montant_paiement:    paiement_latrine_prestataire.montant_paiement,
                    //pourcentage_paiement: paiement_latrine_prestataire.pourcentage_paiement,
                    observation: paiement_latrine_prestataire.observation,
                    date_paiement: convertionDate(new Date(paiement_latrine_prestataire.date_paiement)), 
                    id_demande_latrine_pre: vm.selectedItemDemande_latrine_prest.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_latrine_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_latrine_prestataire == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_latrine_prestataire.$selected  = false;
                        vm.selectedItemPaiement_latrine_prestataire.$edit      = false;
                        vm.selectedItemPaiement_latrine_prestataire ={};
                    }
                    else 
                    {    
                      vm.allpaiement_latrine_prestataire = vm.allpaiement_latrine_prestataire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_latrine_prestataire.id;
                      });
                      vm.showbuttonNouvpaiement_latrine_prestataire = true;
                    }
                }
                else
                {
                  paiement_latrine_prestataire.id  =   String(data.response);              
                  NouvelItemPaiement_latrine_prestataire = false;

                  vm.showbuttonNouvPaiement_latrine_prestataire = false;
            }
              paiement_latrine_prestataire.$selected = false;
              paiement_latrine_prestataire.$edit = false;
              vm.selectedItemPaiement_latrine_prestataire = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/
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
