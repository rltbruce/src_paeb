(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.paiement_pr.paiement_batiment_pr')
        .controller('Paiement_batiment_prController', Paiement_batiment_prController);
    /** @ngInject */
    function Paiement_batiment_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemDemande_batiment_pr = {};
        vm.alldemande_batiment_pr = [];

        var NouvelItemPaiement_batiment_pr = false;
        var currentItemPaiement_batiment_pr;
        vm.selectedItemPaiement_batiment_pr = {} ;
        vm.ajoutPaiement_batiment_pr  = ajoutPaiement_batiment_pr ;
        vm.allpaiement_batiment_pr = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


/**********************************debut demande_batiment_pr****************************************/

      apiFactory.getAPIgeneraliserREST("demande_batiment_pr/index",'menu','getdemandeByValide').then(function(result)
      {
          vm.alldemande_batiment_pr = result.data.response;
      });
//col table
        vm.demande_batiment_pr_column = [
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
        },
        {titre:"Action"
        }];
   

        //fonction selection item Demande_batiment_pr
        vm.selectionDemande_batiment_pr= function (item)
        {
            vm.selectedItemDemande_batiment_pr = item;
            //vm.nouvelItemDemande_batiment_pr   = item;
            //currentItemDemande_batiment_pr    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_pr));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_batiment_pr/index",'id_demande_batiment_pr',vm.selectedItemDemande_batiment_pr.id).then(function(result)
            {
                vm.allpaiement_batiment_pr = result.data.response;
                console.log(vm.allpaiement_batiment_pr);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_pr', function()
        {
             if (!vm.alldemande_batiment_pr) return;
             vm.alldemande_batiment_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_pr.$selected = true;
        });

        vm.validerDemande_batiment_pr= function(demande_batiment_pr,suppression,validation)
        {
            insert_in_baseDemande_batiment_pr(demande_batiment_pr,suppression,validation);
           
        }
  

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_pr
        function insert_in_baseDemande_batiment_pr(demande_batiment_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_pr.id,
                    objet: demande_batiment_pr.objet,
                    description:demande_batiment_pr.description,
                    ref_facture:demande_batiment_pr.ref_facture,
                    id_tranche_demande_batiment_pr: demande_batiment_pr.tranche.id ,
                    montant: demande_batiment_pr.montant,
                    cumul: demande_batiment_pr.cumul ,
                    anterieur: demande_batiment_pr.anterieur ,
                    reste: demande_batiment_pr.reste ,
                    date: convertionDate(new Date(demande_batiment_pr.date)),
                    id_batiment_construction: demande_batiment_pr.batiment_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_batiment_pr = vm.alldemande_batiment_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_batiment_pr.id;
                });
              demande_batiment_pr.$selected = false;
              demande_batiment_pr.$edit = false;
              vm.selectedItemDemande_batiment_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************debut paiement****************************************/
//col table
        vm.paiement_batiment_pr_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_batiment_pr = function ()
        { 
          if (NouvelItemPaiement_batiment_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_batiment_pr.push(items);
            vm.allpaiement_batiment_pr.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_batiment_pr = conv;
              }
            });

            NouvelItemPaiement_batiment_pr = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_batiment_pr(paiement_batiment_pr,suppression)
        {
            if (NouvelItemPaiement_batiment_pr==false)
            {
                test_existancePaiement_batiment_pr (paiement_batiment_pr,suppression); 
            } 
            else
            {
                insert_in_basePaiement_batiment_pr(paiement_batiment_pr,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_batiment_pr
        vm.annulerPaiement_batiment_pr = function(item)
        {
          if (NouvelItemPaiement_batiment_pr == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_batiment_pr.montant_paiement;
              item.observation    = currentItemPaiement_batiment_pr.observation;
              item.date_paiement = currentItemPaiement_batiment_pr.date_paiement; 
          }else
          {
            vm.allpaiement_batiment_pr = vm.allpaiement_batiment_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_batiment_pr.id;
            });
          }

          vm.selectedItemPaiement_batiment_pr = {} ;
          NouvelItemPaiement_batiment_pr      = false;
          
        };

        //fonction selection item paiement_batiment_pr convention cisco/feffi
        vm.selectionPaiement_batiment_pr = function (item)
        {
            vm.selectedItemPaiement_batiment_pr = item;
            currentItemPaiement_batiment_pr     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_batiment_pr));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_batiment_pr', function()
        {
             if (!vm.allpaiement_batiment_pr) return;
             vm.allpaiement_batiment_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_batiment_pr.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_batiment_pr = function(item)
        {
            NouvelItemPaiement_batiment_pr = false ;
            vm.selectedItemPaiement_batiment_pr = item;
            currentItemPaiement_batiment_pr = angular.copy(vm.selectedItemPaiement_batiment_pr);
            $scope.vm.allpaiement_batiment_pr.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_batiment_pr.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_batiment_pr.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_batiment_pr.date_paiement);
        };

        //fonction bouton suppression item paiement_batiment_pr convention cisco feffi
        vm.supprimerPaiement_batiment_pr = function()
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
                vm.ajoutPaiement_batiment_pr(vm.selectedItemPaiement_batiment_pr,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_batiment_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_batiment_pr.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_batiment_pr.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_batiment_pr.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_batiment_pr.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_batiment_pr.montant_paiement))                    
                      {
                          insert_in_basePaiement_batiment_pr(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_batiment_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_batiment_pr(paiement_batiment_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_pr ==false)
            {
                getId = vm.selectedItemPaiement_batiment_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_batiment_pr.montant_paiement,
                    observation: paiement_batiment_pr.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_pr.date_paiement)), 
                    id_demande_batiment_pr: vm.selectedItemDemande_batiment_pr.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_pr/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_batiment_pr == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_batiment_pr.$selected  = false;
                        vm.selectedItemPaiement_batiment_pr.$edit      = false;
                        vm.selectedItemPaiement_batiment_pr ={};
                    }
                    else 
                    {    
                      vm.allpaiement_batiment_pr = vm.allpaiement_batiment_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_batiment_pr.id;
                      });
                      vm.showbuttonNouvpaiement_batiment_pr = true;
                    }
                }
                else
                {
                  paiement_batiment_pr.id  =   String(data.response);              
                  NouvelItemPaiement_batiment_pr = false;

                  vm.showbuttonNouvPaiement_batiment_pr = false;
            }
              paiement_batiment_pr.$selected = false;
              paiement_batiment_pr.$edit = false;
              vm.selectedItemPaiement_batiment_pr = {};
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
