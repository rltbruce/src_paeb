(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.payement_prestataire')
        .controller('Payement_prestataireController', Payement_prestataireController);
    /** @ngInject */
    function Payement_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
       /* vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;*/

        var currentItemDemande_payement_prest;
        vm.selectedItemDemande_payement_prest = {} ;
        vm.alldemande_payement_prest = [] ;

        var NouvelItemPaiement_prestataire = false;
        var currentItemPaiement_prestataire;
        vm.selectedItemPaiement_prestataire = {} ;
        vm.ajoutPaiement_prestataire  = ajoutPaiement_prestataire ;
        vm.allpaiement_prestataire = [] ;

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
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];*/


          apiFactory.getAPIgeneraliserREST("demande_payement_prestataire/index",'menu','getdemandeValide').then(function(result)
          {
            vm.alldemande_payement_prest = result.data.response;
          });

/**********************************debut demande_payement_prest****************************************/
//col table
        vm.demande_payement_prest_column = [
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Montant"
        },
        {titre:"Date facture"
        },
        {titre:"Date approbation"
        }];

        //fonction selection item Demande_payement_prest
        vm.selectionDemande_payement_prest= function (item)
        {
            vm.selectedItemDemande_payement_prest = item;
            vm.nouvelItemDemande_payement_prest   = item;
            currentItemDemande_payement_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_payement_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_attachement/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_attachement = result.data.response;
                console.log(vm.alljustificatif_attachement);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
           }
            console.log(vm.selectedItemDemande_payement_prest) ;
        };
        $scope.$watch('vm.selectedItemDemande_payement_prest', function()
        {
             if (!vm.alldemande_payement_prest) return;
             vm.alldemande_payement_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_payement_prest.$selected = true;
        });
/**********************************fin demande_payement_prest****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_prestataire_column = [        
        {titre:"Montant"},
        {titre:"Cumul"},
        {titre:"Date paiement"},
        {titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_prestataire = function ()
        { 
          if (NouvelItemPaiement_prestataire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              cumul:'',
              montant_paiement:'',
              pourcentage_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_prestataire.push(items);
            vm.allpaiement_prestataire.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_prestataire = conv;
              }
            });

            NouvelItemPaiement_prestataire = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_prestataire(paiement_prestataire,suppression)
        {
            if (NouvelItemPaiement_prestataire==false)
            {
                test_existancePaiement_prestataire (paiement_prestataire,suppression); 
            } 
            else
            {
                insert_in_basePaiement_prestataire(paiement_prestataire,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_prestataire
        vm.annulerPaiement_prestataire = function(item)
        {
          if (NouvelItemPaiement_prestataire == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.cumul = currentItemPaiement_prestataire.cumul;
              item.montant_paiement = currentItemPaiement_prestataire.montant_paiement;
              item.pourcentage_paiement = currentItemPaiement_prestataire.pourcentage_paiement;
              //item.id_compte_feffi = currentItemPaiement_prestataire.compte_feffi.id;
              item.observation    = currentItemPaiement_prestataire.observation;
              item.date_paiement = currentItemPaiement_prestataire.date_paiement; 
          }else
          {
            vm.allpaiement_prestataire = vm.allpaiement_prestataire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_prestataire.id;
            });
          }

          vm.selectedItemPaiement_prestataire = {} ;
          NouvelItemPaiement_prestataire      = false;
          
        };

        //fonction selection item paiement_prestataire convention cisco/feffi
        vm.selectionPaiement_prestataire = function (item)
        {
            vm.selectedItemPaiement_prestataire = item;
            currentItemPaiement_prestataire     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_prestataire));
           // vm.allconvention= [] ;
            vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_prestataire', function()
        {
             if (!vm.allpaiement_prestataire) return;
             vm.allpaiement_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_prestataire.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_prestataire = function(item)
        {
            NouvelItemPaiement_prestataire = false ;
            vm.selectedItemPaiement_prestataire = item;
            currentItemPaiement_prestataire = angular.copy(vm.selectedItemPaiement_prestataire);
            $scope.vm.allpaiement_prestataire.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.cumul = parseInt(vm.selectedItemPaiement_prestataire.cumul) ;
            item.montant_paiement = parseInt(vm.selectedItemPaiement_prestataire.montant_paiement) ;
            item.pourcentage_paiement = parseInt(vm.selectedItemPaiement_prestataire.pourcentage_paiement );
            item.observation = vm.selectedItemPaiement_prestataire.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_prestataire.date_paiement);
        };

        //fonction bouton suppression item paiement_prestataire convention cisco feffi
        vm.supprimerPaiement_prestataire = function()
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
                vm.ajoutPaiement_prestataire(vm.selectedItemPaiement_prestataire,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_prestataire (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_prestataire.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_prestataire.id;
                });
                if(convT[0])
                {
                   if((convT[0].cumul!=currentItemPaiement_prestataire.cumul)
                    || (convT[0].observation!=currentItemPaiement_prestataire.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_prestataire.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_prestataire.montant_paiement)
                    || (convT[0].pourcentage_paiement!=currentItemPaiement_prestataire.pourcentage_paiement))                    
                      {
                          insert_in_basePaiement_prestataire(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_prestataire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_prestataire(paiement_prestataire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_prestataire ==false)
            {
                getId = vm.selectedItemPaiement_prestataire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    cumul:    paiement_prestataire.cumul,
                    montant_paiement:    paiement_prestataire.montant_paiement,
                    pourcentage_paiement: paiement_prestataire.pourcentage_paiement,
                    observation: paiement_prestataire.observation,
                    date_paiement: convertionDate(new Date(paiement_prestataire.date_paiement)), 
                    id_demande_prestataire: vm.selectedItemDemande_payement_prest.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_prestataire == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_prestataire.cumul  = paiement_prestataire.cumul;
                        vm.selectedItemPaiement_prestataire.montant_paiement  = paiement_prestataire.montant_paiement;
                        vm.selectedItemPaiement_prestataire.pourcentage_paiement  = paiement_prestataire.pourcentage_paiement;
                        vm.selectedItemPaiement_prestataire.observation   = paiement_prestataire.observation;
                        vm.selectedItemPaiement_prestataire.date_paiement   = paiement_prestataire.date_paiement;
                        vm.selectedItemPaiement_prestataire.$selected  = false;
                        vm.selectedItemPaiement_prestataire.$edit      = false;
                        vm.selectedItemPaiement_prestataire ={};
                    }
                    else 
                    {    
                      vm.allpaiement_prestataire = vm.allpaiement_prestataire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_prestataire.id;
                      });
                      vm.showbuttonNouvpaiement_prestataire = true;
                    }
                }
                else
                {
                  paiement_prestataire.cumul  = paiement_prestataire.cumul;
                  paiement_prestataire.montant_paiement  = paiement_prestataire.montant_paiement;
                  paiement_prestataire.pourcentage_paiement  = paiement_prestataire.pourcentage_paiement;
                  paiement_prestataire.observation   = paiement_prestataire.observation;
                  paiement_prestataire.date_paiement   = paiement_prestataire.date_paiement;
                  paiement_prestataire.id  =   String(data.response);              
                  NouvelItemPaiement_prestataire = false;
console.log(paiement_prestataire);
                  vm.showbuttonNouvPaiement_prestataire = false;
            }
              paiement_prestataire.$selected = false;
              paiement_prestataire.$edit = false;
              vm.selectedItemPaiement_prestataire = {};
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
