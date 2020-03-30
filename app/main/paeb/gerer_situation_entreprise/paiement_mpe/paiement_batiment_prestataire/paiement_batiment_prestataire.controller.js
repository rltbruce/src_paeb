(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.paiement_mpe.paiement_batiment_prestataire')
        .controller('Paiement_batiment_prestataireController', Paiement_batiment_prestataireController);
    /** @ngInject */
    function Paiement_batiment_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;
       /* vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;*/

        var currentItemDemande_batiment_prest;
        vm.selectedItemDemande_batiment_prest = {} ;
        vm.alldemande_batiment_prest = [] ;

        vm.allinfosupplement = [] ;

        var NouvelItemPaiement_batiment_prestataire = false;
        var currentItemPaiement_batiment_prestataire;
        vm.selectedItemPaiement_batiment_prestataire = {} ;
        vm.ajoutPaiement_batiment_prestataire  = ajoutPaiement_batiment_prestataire ;
        vm.allpaiement_batiment_prestataire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

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
            /*apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontrat_prestataireBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allcontrat_prestataire = result.data.response; 
                console.log(vm.allcontrat_prestataire);
            });*/
            
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index",'menu','getdemandeValideBycisco','id_cisco',usercisco.id).then(function(result)
            {
              vm.alldemande_batiment_prest = result.data.response;
            });
          }
          

        });

          

/**********************************debut demande_batiment_prest****************************************/
//col table
        vm.demande_batiment_prest_column = [
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

        //fonction selection item Demande_batiment_prest
        vm.selectionDemande_batiment_prest= function (item)
        {
            vm.selectedItemDemande_batiment_prest = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'id_demande_batiment_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.allpaiement_batiment_prestataire = result.data.response;
                console.log(vm.allpaiement_batiment_prestataire);
            });
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratconvenBydemande_batiment','id_demande_batiment_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.allinfosupplement = result.data.response;
            });

            vm.stepOne = true;
            vm.stepTwo = false;

           }
            console.log(vm.selectedItemDemande_batiment_prest) ;
        };
        $scope.$watch('vm.selectedItemDemande_batiment_prest', function()
        {
             if (!vm.alldemande_batiment_prest) return;
             vm.alldemande_batiment_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_prest.$selected = true;
        });
/**********************************fin demande_payement_prest****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_batiment_prestataire_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_batiment_prestataire = function ()
        { 
          if (NouvelItemPaiement_batiment_prestataire == false)
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
            vm.allpaiement_batiment_prestataire.push(items);
            vm.allpaiement_batiment_prestataire.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_batiment_prestataire = conv;
              }
            });

            NouvelItemPaiement_batiment_prestataire = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_batiment_prestataire(paiement_batiment_prestataire,suppression)
        {
            if (NouvelItemPaiement_batiment_prestataire==false)
            {
                test_existancePaiement_batiment_prestataire (paiement_batiment_prestataire,suppression); 
            } 
            else
            {
                insert_in_basePaiement_batiment_prestataire(paiement_batiment_prestataire,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_batiment_prestataire
        vm.annulerPaiement_batiment_prestataire = function(item)
        {
          if (NouvelItemPaiement_batiment_prestataire == false)
          {
              item.$edit = false;
              item.$selected = false;
              //item.cumul = currentItemPaiement_batiment_prestataire.cumul;
              item.montant_paiement = currentItemPaiement_batiment_prestataire.montant_paiement;
              //item.pourcentage_paiement = currentItemPaiement_batiment_prestataire.pourcentage_paiement;
              //item.id_compte_feffi = currentItemPaiement_batiment_prestataire.compte_feffi.id;
              item.observation    = currentItemPaiement_batiment_prestataire.observation;
              item.date_paiement = currentItemPaiement_batiment_prestataire.date_paiement; 
          }else
          {
            vm.allpaiement_batiment_prestataire = vm.allpaiement_batiment_prestataire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_batiment_prestataire.id;
            });
          }

          vm.selectedItemPaiement_batiment_prestataire = {} ;
          NouvelItemPaiement_batiment_prestataire      = false;
          
        };

        //fonction selection item paiement_batiment_prestataire convention cisco/feffi
        vm.selectionPaiement_batiment_prestataire = function (item)
        {
            vm.selectedItemPaiement_batiment_prestataire = item;
            currentItemPaiement_batiment_prestataire     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_batiment_prestataire));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_batiment_prestataire', function()
        {
             if (!vm.allpaiement_batiment_prestataire) return;
             vm.allpaiement_batiment_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_batiment_prestataire.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_batiment_prestataire = function(item)
        {
            NouvelItemPaiement_batiment_prestataire = false ;
            vm.selectedItemPaiement_batiment_prestataire = item;
            currentItemPaiement_batiment_prestataire = angular.copy(vm.selectedItemPaiement_batiment_prestataire);
            $scope.vm.allpaiement_batiment_prestataire.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            //item.cumul = parseInt(vm.selectedItemPaiement_batiment_prestataire.cumul) ;
            item.montant_paiement = parseInt(vm.selectedItemPaiement_batiment_prestataire.montant_paiement) ;
            //item.pourcentage_paiement = parseInt(vm.selectedItemPaiement_batiment_prestataire.pourcentage_paiement );
            item.observation = vm.selectedItemPaiement_batiment_prestataire.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_batiment_prestataire.date_paiement);
        };

        //fonction bouton suppression item paiement_batiment_prestataire convention cisco feffi
        vm.supprimerPaiement_batiment_prestataire = function()
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
                vm.ajoutPaiement_batiment_prestataire(vm.selectedItemPaiement_batiment_prestataire,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_batiment_prestataire (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_batiment_prestataire.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_batiment_prestataire.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_batiment_prestataire.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_batiment_prestataire.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_batiment_prestataire.montant_paiement))                    
                      {
                          insert_in_basePaiement_batiment_prestataire(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_batiment_prestataire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_batiment_prestataire(paiement_batiment_prestataire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_prestataire ==false)
            {
                getId = vm.selectedItemPaiement_batiment_prestataire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    //cumul:    paiement_batiment_prestataire.cumul,
                    montant_paiement:    paiement_batiment_prestataire.montant_paiement,
                    //pourcentage_paiement: paiement_batiment_prestataire.pourcentage_paiement,
                    observation: paiement_batiment_prestataire.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_prestataire.date_paiement)), 
                    id_demande_batiment_pre: vm.selectedItemDemande_batiment_prest.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_batiment_prestataire == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_batiment_prestataire.$selected  = false;
                        vm.selectedItemPaiement_batiment_prestataire.$edit      = false;
                        vm.selectedItemPaiement_batiment_prestataire ={};
                    }
                    else 
                    {    
                      vm.allpaiement_batiment_prestataire = vm.allpaiement_batiment_prestataire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_batiment_prestataire.id;
                      });
                      vm.showbuttonNouvpaiement_batiment_prestataire = true;
                    }
                }
                else
                {
                  paiement_batiment_prestataire.id  =   String(data.response);              
                  NouvelItemPaiement_batiment_prestataire = false;

                  vm.showbuttonNouvPaiement_batiment_prestataire = false;
            }
              paiement_batiment_prestataire.$selected = false;
              paiement_batiment_prestataire.$edit = false;
              vm.selectedItemPaiement_batiment_prestataire = {};
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
