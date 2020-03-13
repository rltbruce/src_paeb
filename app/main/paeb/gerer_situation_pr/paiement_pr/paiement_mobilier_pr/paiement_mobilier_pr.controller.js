(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.paiement_pr.paiement_mobilier_pr')
        .controller('Paiement_mobilier_prController', Paiement_mobilier_prController);
    /** @ngInject */
    function Paiement_mobilier_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemDemande_mobilier_pr = {};
        vm.alldemande_mobilier_pr = [];

        var NouvelItemPaiement_mobilier_pr = false;
        var currentItemPaiement_mobilier_pr;
        vm.selectedItemPaiement_mobilier_pr = {} ;
        vm.ajoutPaiement_mobilier_pr  = ajoutPaiement_mobilier_pr ;
        vm.allpaiement_mobilier_pr = [] ;


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


/**********************************debut demande_mobilier_pr****************************************/
      apiFactory.getAPIgeneraliserREST("demande_mobilier_pr/index",'menu','getdemandeByValide').then(function(result)
      {
          vm.alldemande_mobilier_pr = result.data.response;
      });

//col table
        vm.demande_mobilier_pr_column = [
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

        //fonction selection item Demande_mobilier_pr
        vm.selectionDemande_mobilier_pr= function (item)
        {
            vm.selectedItemDemande_mobilier_pr = item;           
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_mobilier_pr/index",'id_demande_mobilier_pr',vm.selectedItemDemande_mobilier_pr.id).then(function(result)
            {
                vm.allpaiement_mobilier_pr = result.data.response;
                console.log(vm.allpaiement_mobilier_pr);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_pr', function()
        {
             if (!vm.alldemande_mobilier_pr) return;
             vm.alldemande_mobilier_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_pr.$selected = true;
        });

        vm.validerDemande_mobilier_pr= function(demande_mobilier_pr,suppression,validation)
        {
            insert_in_baseDemande_mobilier_pr(demande_mobilier_pr,suppression,validation);           
        }
        //insertion ou mise a jours ou suppression item dans bdd Demande_mobilier_pr
        function insert_in_baseDemande_mobilier_pr(demande_mobilier_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_mobilier_pr.id,
                    objet: demande_mobilier_pr.objet,
                    description:demande_mobilier_pr.description,
                    ref_facture:demande_mobilier_pr.ref_facture,
                    id_tranche_demande_mobilier_pr: demande_mobilier_pr.tranche.id ,
                    montant: demande_mobilier_pr.montant,
                    cumul: demande_mobilier_pr.cumul ,
                    anterieur: demande_mobilier_pr.anterieur ,
                    reste: demande_mobilier_pr.reste ,
                    date: convertionDate(new Date(demande_mobilier_pr.date)),
                    id_mobilier_construction: demande_mobilier_pr.mobilier_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_mobilier_pr = vm.alldemande_mobilier_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_mobilier_pr.id;
                });
              demande_mobilier_pr.$selected = false;
              demande_mobilier_pr.$edit = false;
              vm.selectedItemDemande_mobilier_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************fin demande_mobilier_pr****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_mobilier_pr_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_mobilier_pr = function ()
        { 
          if (NouvelItemPaiement_mobilier_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_mobilier_pr.push(items);
            vm.allpaiement_mobilier_pr.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_mobilier_pr = conv;
              }
            });

            NouvelItemPaiement_mobilier_pr = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_mobilier_pr(paiement_mobilier_pr,suppression)
        {
            if (NouvelItemPaiement_mobilier_pr==false)
            {
                test_existancePaiement_mobilier_pr (paiement_mobilier_pr,suppression); 
            } 
            else
            {
                insert_in_basePaiement_mobilier_pr(paiement_mobilier_pr,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_mobilier_pr
        vm.annulerPaiement_mobilier_pr = function(item)
        {
          if (NouvelItemPaiement_mobilier_pr == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_mobilier_pr.montant_paiement;
              item.observation    = currentItemPaiement_mobilier_pr.observation;
              item.date_paiement = currentItemPaiement_mobilier_pr.date_paiement; 
          }else
          {
            vm.allpaiement_mobilier_pr = vm.allpaiement_mobilier_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_mobilier_pr.id;
            });
          }

          vm.selectedItemPaiement_mobilier_pr = {} ;
          NouvelItemPaiement_mobilier_pr      = false;
          
        };

        //fonction selection item paiement_mobilier_pr convention cisco/feffi
        vm.selectionPaiement_mobilier_pr = function (item)
        {
            vm.selectedItemPaiement_mobilier_pr = item;
            currentItemPaiement_mobilier_pr     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_mobilier_pr));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_mobilier_pr', function()
        {
             if (!vm.allpaiement_mobilier_pr) return;
             vm.allpaiement_mobilier_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_mobilier_pr.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_mobilier_pr = function(item)
        {
            NouvelItemPaiement_mobilier_pr = false ;
            vm.selectedItemPaiement_mobilier_pr = item;
            currentItemPaiement_mobilier_pr = angular.copy(vm.selectedItemPaiement_mobilier_pr);
            $scope.vm.allpaiement_mobilier_pr.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_mobilier_pr.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_mobilier_pr.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_mobilier_pr.date_paiement);
        };

        //fonction bouton suppression item paiement_mobilier_pr convention cisco feffi
        vm.supprimerPaiement_mobilier_pr = function()
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
                vm.ajoutPaiement_mobilier_pr(vm.selectedItemPaiement_mobilier_pr,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_mobilier_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_mobilier_pr.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_mobilier_pr.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_mobilier_pr.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_mobilier_pr.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_mobilier_pr.montant_paiement))                    
                      {
                          insert_in_basePaiement_mobilier_pr(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_mobilier_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_mobilier_pr(paiement_mobilier_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_mobilier_pr ==false)
            {
                getId = vm.selectedItemPaiement_mobilier_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_mobilier_pr.montant_paiement,
                    observation: paiement_mobilier_pr.observation,
                    date_paiement: convertionDate(new Date(paiement_mobilier_pr.date_paiement)), 
                    id_demande_mobilier_pr: vm.selectedItemDemande_mobilier_pr.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_mobilier_pr/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_mobilier_pr == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_mobilier_pr.$selected  = false;
                        vm.selectedItemPaiement_mobilier_pr.$edit      = false;
                        vm.selectedItemPaiement_mobilier_pr ={};
                    }
                    else 
                    {    
                      vm.allpaiement_mobilier_pr = vm.allpaiement_mobilier_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_mobilier_pr.id;
                      });
                      vm.showbuttonNouvpaiement_mobilier_pr = true;
                    }
                }
                else
                {
                  paiement_mobilier_pr.id  =   String(data.response);              
                  NouvelItemPaiement_mobilier_pr = false;

                  vm.showbuttonNouvPaiement_mobilier_pr = false;
            }
              paiement_mobilier_pr.$selected = false;
              paiement_mobilier_pr.$edit = false;
              vm.selectedItemPaiement_mobilier_pr = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/



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
