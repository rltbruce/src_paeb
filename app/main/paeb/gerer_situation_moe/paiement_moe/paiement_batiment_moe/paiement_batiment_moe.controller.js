(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.paiement_moe.paiement_batiment_moe')
        .controller('Paiement_batiment_moeController', Paiement_batiment_moeController);
    /** @ngInject */
    function Paiement_batiment_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;

        vm.selectedItemDemande_batiment_moe = {};
        vm.alldemande_batiment_moe = [];

        var NouvelItemPaiement_batiment_moe = false;
        var currentItemPaiement_batiment_moe;
        vm.selectedItemPaiement_batiment_moe = {} ;
        vm.ajoutPaiement_batiment_moe  = ajoutPaiement_batiment_moe ;
        vm.allpaiement_batiment_moe = [] ;

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


/**********************************debut demande_batiment_moe****************************************/

     /* apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index",'menu','getdemandeByValide').then(function(result)
      {
          vm.alldemande_batiment_moe = result.data.response;
      });*/

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index",'menu','getalldemandevalideBycisco','id_cisco',usercisco.id).then(function(result)
              {
                  vm.alldemande_batiment_moe = result.data.response;
                  console.log(vm.alldemande_batiment_moe);
              });

          }
        });
//col table
        vm.demande_batiment_moe_column = [
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
   

        //fonction selection item Demande_batiment_moe
        vm.selectionDemande_batiment_moe= function (item)
        {
            vm.selectedItemDemande_batiment_moe = item;
            //vm.nouvelItemDemande_batiment_moe   = item;
            //currentItemDemande_batiment_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_moe));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
            {
                vm.allpaiement_batiment_moe = result.data.response;
                console.log(vm.allpaiement_batiment_moe);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_moe', function()
        {
             if (!vm.alldemande_batiment_moe) return;
             vm.alldemande_batiment_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_moe.$selected = true;
        });

        vm.validerDemande_batiment_moe= function(demande_batiment_moe,suppression,validation)
        {
            insert_in_baseDemande_batiment_moe(demande_batiment_moe,suppression,validation);
           
        }
  

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_moe
        function insert_in_baseDemande_batiment_moe(demande_batiment_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_moe.id,
                    objet: demande_batiment_moe.objet,
                    description:demande_batiment_moe.description,
                    ref_facture:demande_batiment_moe.ref_facture,
                    id_tranche_demande_batiment_moe: demande_batiment_moe.tranche.id ,
                    montant: demande_batiment_moe.montant,
                    cumul: demande_batiment_moe.cumul ,
                    anterieur: demande_batiment_moe.anterieur ,
                    reste: demande_batiment_moe.reste ,
                    date: convertionDate(new Date(demande_batiment_moe.date)),
                    id_batiment_construction: demande_batiment_moe.batiment_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_moe/index",datas, config).success(function (data)
            {   

                vm.alldemande_batiment_moe = vm.alldemande_batiment_moe.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_batiment_moe.id;
                });
              demande_batiment_moe.$selected = false;
              demande_batiment_moe.$edit = false;
              vm.selectedItemDemande_batiment_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************debut paiement****************************************/
//col table
        vm.paiement_batiment_moe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_batiment_moe = function ()
        { 
          if (NouvelItemPaiement_batiment_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_batiment_moe.push(items);
            vm.allpaiement_batiment_moe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_batiment_moe = conv;
              }
            });

            NouvelItemPaiement_batiment_moe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_batiment_moe(paiement_batiment_moe,suppression)
        {
            if (NouvelItemPaiement_batiment_moe==false)
            {
                test_existancePaiement_batiment_moe (paiement_batiment_moe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_batiment_moe(paiement_batiment_moe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_batiment_moe
        vm.annulerPaiement_batiment_moe = function(item)
        {
          if (NouvelItemPaiement_batiment_moe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_batiment_moe.montant_paiement;
              item.observation    = currentItemPaiement_batiment_moe.observation;
              item.date_paiement = currentItemPaiement_batiment_moe.date_paiement; 
          }else
          {
            vm.allpaiement_batiment_moe = vm.allpaiement_batiment_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_batiment_moe.id;
            });
          }

          vm.selectedItemPaiement_batiment_moe = {} ;
          NouvelItemPaiement_batiment_moe      = false;
          
        };

        //fonction selection item paiement_batiment_moe convention cisco/feffi
        vm.selectionPaiement_batiment_moe = function (item)
        {
            vm.selectedItemPaiement_batiment_moe = item;
            currentItemPaiement_batiment_moe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_batiment_moe));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_batiment_moe', function()
        {
             if (!vm.allpaiement_batiment_moe) return;
             vm.allpaiement_batiment_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_batiment_moe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_batiment_moe = function(item)
        {
            NouvelItemPaiement_batiment_moe = false ;
            vm.selectedItemPaiement_batiment_moe = item;
            currentItemPaiement_batiment_moe = angular.copy(vm.selectedItemPaiement_batiment_moe);
            $scope.vm.allpaiement_batiment_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_batiment_moe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_batiment_moe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_batiment_moe.date_paiement);
        };

        //fonction bouton suppression item paiement_batiment_moe convention cisco feffi
        vm.supprimerPaiement_batiment_moe = function()
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
                vm.ajoutPaiement_batiment_moe(vm.selectedItemPaiement_batiment_moe,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_batiment_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_batiment_moe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_batiment_moe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_batiment_moe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_batiment_moe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_batiment_moe.montant_paiement))                    
                      {
                          insert_in_basePaiement_batiment_moe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_batiment_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_batiment_moe(paiement_batiment_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_moe ==false)
            {
                getId = vm.selectedItemPaiement_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_batiment_moe.montant_paiement,
                    observation: paiement_batiment_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_moe.date_paiement)), 
                    id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_moe/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_batiment_moe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_batiment_moe.$selected  = false;
                        vm.selectedItemPaiement_batiment_moe.$edit      = false;
                        vm.selectedItemPaiement_batiment_moe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_batiment_moe = vm.allpaiement_batiment_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_batiment_moe.id;
                      });
                      vm.showbuttonNouvpaiement_batiment_moe = true;
                    }
                }
                else
                {
                  paiement_batiment_moe.id  =   String(data.response);              
                  NouvelItemPaiement_batiment_moe = false;

                  vm.showbuttonNouvPaiement_batiment_moe = false;
            }
              paiement_batiment_moe.$selected = false;
              paiement_batiment_moe.$edit = false;
              vm.selectedItemPaiement_batiment_moe = {};
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
