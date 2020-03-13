(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.paiement_pr.paiement_fin_travaux_pr')

        .controller('Paiement_fin_travaux_prController', Paiement_fin_travaux_prController);
    /** @ngInject */
    function Paiement_fin_travaux_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemDemande_fin_travaux_pr = {};
        vm.alldemande_fin_travaux_pr = [];

        var NouvelItemPaiement_fin_travaux_pr = false;
        var currentItemPaiement_fin_travaux_pr;
        vm.selectedItemPaiement_fin_travaux_pr = {} ;
        vm.ajoutPaiement_fin_travaux_pr  = ajoutPaiement_fin_travaux_pr ;
        vm.allpaiement_fin_travaux_pr = [] ;

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


/**********************************fin demande_fin_travaux_pr****************************************/
//col table
        vm.demande_fin_travaux_pr_column = [
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
    
    apiFactory.getAPIgeneraliserREST("demande_fin_travaux_pr/index",'menu','getdemandeByValide').then(function(result)
    {
        vm.alldemande_fin_travaux_pr = result.data.response;
                  console.log(vm.alldemande_fin_travaux_pr);
    });

        //fonction selection item Demande_fin_travaux_pr
        vm.selectionDemande_fin_travaux_pr= function (item)
        {
            vm.selectedItemDemande_fin_travaux_pr = item;
           
           if(item.id!=0)
           {
           apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_pr/index",'id_demande_fin_travaux_pr',vm.selectedItemDemande_fin_travaux_pr.id).then(function(result)
            {
                vm.allpaiement_fin_travaux_pr = result.data.response;
                console.log(vm.allpaiement_fin_travaux_pr);
            });

            vm.stepTwo = false;
            vm.stepOne = true;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_fin_travaux_pr', function()
        {
             if (!vm.alldemande_fin_travaux_pr) return;
             vm.alldemande_fin_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_fin_travaux_pr.$selected = true;
        });

        vm.validerDemande_fin_travaux_pr= function(demande_fin_travaux_pr,suppression,validation)
        {
            insert_in_baseDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression,validation);           
        }     

        //insertion ou mise a jours ou suppression item dans bdd Demande_fin_travaux_pr
        function insert_in_baseDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_fin_travaux_pr.id,
                    objet: demande_fin_travaux_pr.objet,
                    description:demande_fin_travaux_pr.description,
                    ref_facture:demande_fin_travaux_pr.ref_facture,
                    id_tranche_d_fin_travaux_pr: demande_fin_travaux_pr.tranche.id ,
                    montant: demande_fin_travaux_pr.montant,
                    cumul: demande_fin_travaux_pr.cumul ,
                    anterieur: demande_fin_travaux_pr.anterieur ,
                    reste: demande_fin_travaux_pr.reste ,
                    date: convertionDate(new Date(demande_fin_travaux_pr.date)),
                    id_contrat_bureau_etude: demande_fin_travaux_pr.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_fin_travaux_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_fin_travaux_pr = vm.alldemande_fin_travaux_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_fin_travaux_pr.id;
                });
              demande_fin_travaux_pr.$selected = false;
              demande_fin_travaux_pr.$edit = false;
              vm.selectedItemDemande_fin_travaux_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

       
/**********************************fin demande_fin_travaux_pr****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_fin_travaux_pr_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_fin_travaux_pr = function ()
        { 
          if (NouvelItemPaiement_fin_travaux_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_fin_travaux_pr.push(items);
            vm.allpaiement_fin_travaux_pr.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_fin_travaux_pr = conv;
              }
            });

            NouvelItemPaiement_fin_travaux_pr = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_fin_travaux_pr(paiement_fin_travaux_pr,suppression)
        {
            if (NouvelItemPaiement_fin_travaux_pr==false)
            {
                test_existancePaiement_fin_travaux_pr (paiement_fin_travaux_pr,suppression); 
            } 
            else
            {
                insert_in_basePaiement_fin_travaux_pr(paiement_fin_travaux_pr,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_fin_travaux_pr
        vm.annulerPaiement_fin_travaux_pr = function(item)
        {
          if (NouvelItemPaiement_fin_travaux_pr == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_fin_travaux_pr.montant_paiement;
              item.observation    = currentItemPaiement_fin_travaux_pr.observation;
              item.date_paiement = currentItemPaiement_fin_travaux_pr.date_paiement; 
          }else
          {
            vm.allpaiement_fin_travaux_pr = vm.allpaiement_fin_travaux_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_fin_travaux_pr.id;
            });
          }

          vm.selectedItemPaiement_fin_travaux_pr = {} ;
          NouvelItemPaiement_fin_travaux_pr      = false;
          
        };

        //fonction selection item paiement_fin_travaux_pr convention cisco/feffi
        vm.selectionPaiement_fin_travaux_pr = function (item)
        {
            vm.selectedItemPaiement_fin_travaux_pr = item;
            currentItemPaiement_fin_travaux_pr     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_fin_travaux_pr));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_fin_travaux_pr', function()
        {
             if (!vm.allpaiement_fin_travaux_pr) return;
             vm.allpaiement_fin_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_fin_travaux_pr.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_fin_travaux_pr = function(item)
        {
            NouvelItemPaiement_fin_travaux_pr = false ;
            vm.selectedItemPaiement_fin_travaux_pr = item;
            currentItemPaiement_fin_travaux_pr = angular.copy(vm.selectedItemPaiement_fin_travaux_pr);
            $scope.vm.allpaiement_fin_travaux_pr.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_fin_travaux_pr.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_fin_travaux_pr.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_fin_travaux_pr.date_paiement);
        };

        //fonction bouton suppression item paiement_fin_travaux_pr convention cisco feffi
        vm.supprimerPaiement_fin_travaux_pr = function()
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
                vm.ajoutPaiement_fin_travaux_pr(vm.selectedItemPaiement_fin_travaux_pr,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_fin_travaux_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_fin_travaux_pr.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_fin_travaux_pr.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_fin_travaux_pr.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_fin_travaux_pr.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_fin_travaux_pr.montant_paiement))                    
                      {
                          insert_in_basePaiement_fin_travaux_pr(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_fin_travaux_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_fin_travaux_pr(paiement_fin_travaux_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_fin_travaux_pr ==false)
            {
                getId = vm.selectedItemPaiement_fin_travaux_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_fin_travaux_pr.montant_paiement,
                    observation: paiement_fin_travaux_pr.observation,
                    date_paiement: convertionDate(new Date(paiement_fin_travaux_pr.date_paiement)), 
                    id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_pr.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_fin_travaux_pr/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_fin_travaux_pr == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_fin_travaux_pr.$selected  = false;
                        vm.selectedItemPaiement_fin_travaux_pr.$edit      = false;
                        vm.selectedItemPaiement_fin_travaux_pr ={};
                    }
                    else 
                    {    
                      vm.allpaiement_fin_travaux_pr = vm.allpaiement_fin_travaux_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_fin_travaux_pr.id;
                      });
                      vm.showbuttonNouvpaiement_fin_travaux_pr = true;
                    }
                }
                else
                {
                  paiement_fin_travaux_pr.id  =   String(data.response);              
                  NouvelItemPaiement_fin_travaux_pr = false;

                  vm.showbuttonNouvPaiement_fin_travaux_pr = false;
            }
              paiement_fin_travaux_pr.$selected = false;
              paiement_fin_travaux_pr.$edit = false;
              vm.selectedItemPaiement_fin_travaux_pr = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/



/**********************************fin pr_sousmissionnaire****************************************/
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
