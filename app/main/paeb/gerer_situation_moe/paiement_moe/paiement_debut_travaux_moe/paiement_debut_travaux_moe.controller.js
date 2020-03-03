(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.paiement_moe.paiement_debut_travaux_moe')

        .controller('Paiement_debut_travaux_moeController', Paiement_debut_travaux_moeController);
    /** @ngInject */
    function Paiement_debut_travaux_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemDemande_debut_travaux_moe = {};
        vm.alldemande_debut_travaux_moe = [];

        var NouvelItemPaiement_debut_travaux_moe = false;
        var currentItemPaiement_debut_travaux_moe;
        vm.selectedItemPaiement_debut_travaux_moe = {} ;
        vm.ajoutPaiement_debut_travaux_moe  = ajoutPaiement_debut_travaux_moe ;
        vm.allpaiement_debut_travaux_moe = [] ;

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


/**********************************debut demande_debut_travaux_moe****************************************/
    apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index",'menu','getdemandeByValide').then(function(result)
    {
        vm.alldemande_debut_travaux_moe = result.data.response;
        console.log(vm.alldemande_debut_travaux_moe);
    });

//col table
        vm.demande_debut_travaux_moe_column = [
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


        //fonction selection item Demande_debut_travaux_moe
        vm.selectionDemande_debut_travaux_moe= function (item)
        {
            vm.selectedItemDemande_debut_travaux_moe = item;
            
           if(item.id!=0)
           {
           apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'id_demande_debut_travaux_moe',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
            {
                vm.allpaiement_debut_travaux_moe = result.data.response;
                console.log(vm.allpaiement_debut_travaux_moe);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_debut_travaux_moe', function()
        {
             if (!vm.alldemande_debut_travaux_moe) return;
             vm.alldemande_debut_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_debut_travaux_moe.$selected = true;
        });

        vm.validerDemande_debut_travaux_moe= function(demande_debut_travaux_moe,suppression,validation)
        {
            insert_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression,validation);
           
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_debut_travaux_moe
        function insert_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_debut_travaux_moe.id,
                    objet: demande_debut_travaux_moe.objet,
                    description:demande_debut_travaux_moe.description,
                    ref_facture:demande_debut_travaux_moe.ref_facture,
                    id_tranche_d_debut_travaux_moe: demande_debut_travaux_moe.tranche.id ,
                    montant: demande_debut_travaux_moe.montant,
                    cumul: demande_debut_travaux_moe.cumul ,
                    anterieur: demande_debut_travaux_moe.anterieur ,
                    reste: demande_debut_travaux_moe.reste ,
                    date: convertionDate(new Date(demande_debut_travaux_moe.date)),
                    id_contrat_bureau_etude: demande_debut_travaux_moe.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_debut_travaux_moe/index",datas, config).success(function (data)
            {  

               vm.alldemande_debut_travaux_moe = vm.alldemande_debut_travaux_moe.filter(function(obj)
              {
                  return obj.id != vm.selectedItemDemande_debut_travaux_moe.id;
              }); 
              demande_debut_travaux_moe.$selected = false;
              vm.selectedItemDemande_debut_travaux_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

       
/**********************************fin demande_debut_travaux_moe****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_debut_travaux_moe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_debut_travaux_moe = function ()
        { 
          if (NouvelItemPaiement_debut_travaux_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_debut_travaux_moe.push(items);
            vm.allpaiement_debut_travaux_moe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_debut_travaux_moe = conv;
              }
            });

            NouvelItemPaiement_debut_travaux_moe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression)
        {
            if (NouvelItemPaiement_debut_travaux_moe==false)
            {
                test_existancePaiement_debut_travaux_moe (paiement_debut_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_debut_travaux_moe
        vm.annulerPaiement_debut_travaux_moe = function(item)
        {
          if (NouvelItemPaiement_debut_travaux_moe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_debut_travaux_moe.montant_paiement;
              item.observation    = currentItemPaiement_debut_travaux_moe.observation;
              item.date_paiement = currentItemPaiement_debut_travaux_moe.date_paiement; 
          }else
          {
            vm.allpaiement_debut_travaux_moe = vm.allpaiement_debut_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_debut_travaux_moe.id;
            });
          }

          vm.selectedItemPaiement_debut_travaux_moe = {} ;
          NouvelItemPaiement_debut_travaux_moe      = false;
          
        };

        //fonction selection item paiement_debut_travaux_moe convention cisco/feffi
        vm.selectionPaiement_debut_travaux_moe = function (item)
        {
            vm.selectedItemPaiement_debut_travaux_moe = item;
            currentItemPaiement_debut_travaux_moe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_debut_travaux_moe));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_debut_travaux_moe', function()
        {
             if (!vm.allpaiement_debut_travaux_moe) return;
             vm.allpaiement_debut_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_debut_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_debut_travaux_moe = function(item)
        {
            NouvelItemPaiement_debut_travaux_moe = false ;
            vm.selectedItemPaiement_debut_travaux_moe = item;
            currentItemPaiement_debut_travaux_moe = angular.copy(vm.selectedItemPaiement_debut_travaux_moe);
            $scope.vm.allpaiement_debut_travaux_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_debut_travaux_moe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_debut_travaux_moe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_debut_travaux_moe.date_paiement);
        };

        //fonction bouton suppression item paiement_debut_travaux_moe convention cisco feffi
        vm.supprimerPaiement_debut_travaux_moe = function()
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
                vm.ajoutPaiement_debut_travaux_moe(vm.selectedItemPaiement_debut_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_debut_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_debut_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_debut_travaux_moe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_debut_travaux_moe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_debut_travaux_moe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_debut_travaux_moe.montant_paiement))                    
                      {
                          insert_in_basePaiement_debut_travaux_moe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_debut_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_debut_travaux_moe ==false)
            {
                getId = vm.selectedItemPaiement_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_debut_travaux_moe.montant_paiement,
                    observation: paiement_debut_travaux_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_debut_travaux_moe.date_paiement)), 
                    id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_debut_travaux_moe/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_debut_travaux_moe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_debut_travaux_moe.$selected  = false;
                        vm.selectedItemPaiement_debut_travaux_moe.$edit      = false;
                        vm.selectedItemPaiement_debut_travaux_moe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_debut_travaux_moe = vm.allpaiement_debut_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_debut_travaux_moe.id;
                      });
                      vm.showbuttonNouvpaiement_debut_travaux_moe = true;
                    }
                }
                else
                {
                  paiement_debut_travaux_moe.id  =   String(data.response);              
                  NouvelItemPaiement_debut_travaux_moe = false;

                  vm.showbuttonNouvPaiement_debut_travaux_moe = false;
            }
              paiement_debut_travaux_moe.$selected = false;
              paiement_debut_travaux_moe.$edit = false;
              vm.selectedItemPaiement_debut_travaux_moe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/


/**********************************fin moe_sousmissionnaire****************************************/
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
    function showDialog($event,items) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '<md-subheader style="background-color: rgb(245,245,245)">'+
            '<h3 mat-dialog-title  style="margin:0px; color: red;">Erreur de suppression de fichier</h3>'+
          '</md-subheader>'+
           '  <md-dialog-content>'+
           '    <p>Veuillez communiquer ce réference à l\'administrateur</p>'+
           '    <p>Réference: {{items}}</p>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Fermer' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: items
         },
         controller: DialogController
      });

    }

      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }  

    }
})();
