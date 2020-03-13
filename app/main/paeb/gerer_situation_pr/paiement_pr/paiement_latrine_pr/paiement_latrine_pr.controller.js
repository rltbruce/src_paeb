(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.paiement_pr.paiement_latrine_pr')
        .controller('Paiement_latrine_prController', Paiement_latrine_prController);
    /** @ngInject */
    function Paiement_latrine_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];
        vm.selectedItemDemande_latrine_pr = {};
        vm.alldemande_latrine_pr = [];

        var NouvelItemPaiement_latrine_pr = false;
        var currentItemPaiement_latrine_pr;
        vm.selectedItemPaiement_latrine_pr = {} ;
        vm.ajoutPaiement_latrine_pr  = ajoutPaiement_latrine_pr ;
        vm.allpaiement_latrine_pr = [] ;

       

        vm.allcurenttranche_demande_latrine_pr = [];
        vm.alltranche_demande_latrine_pr = [];
        vm.dernierdemande = [];

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



/**********************************debut demande_latrine_pr****************************************/
      apiFactory.getAPIgeneraliserREST("demande_latrine_pr/index",'menu','getdemandeByValide').then(function(result)
      {
          vm.alldemande_latrine_pr = result.data.response;
      });

//col table
        vm.demande_latrine_pr_column = [
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

  
        //fonction selection item Demande_latrine_pr
        vm.selectionDemande_latrine_pr= function (item)
        {
            vm.selectedItemDemande_latrine_pr = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_latrine_pr/index",'id_demande_latrine_pr',vm.selectedItemDemande_latrine_pr.id).then(function(result)
            {
                vm.allpaiement_latrine_pr = result.data.response;
                console.log(vm.allpaiement_latrine_pr);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_latrine_pr', function()
        {
             if (!vm.alldemande_latrine_pr) return;
             vm.alldemande_latrine_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_pr.$selected = true;
        });

        vm.validerDemande_latrine_pr= function(demande_latrine_pr,suppression,validation)
        {
            insert_in_baseDemande_latrine_pr(demande_latrine_pr,suppression,validation);           
        }


        //insertion ou mise a jours ou suppression item dans bdd Demande_latrine_pr
        function insert_in_baseDemande_latrine_pr(demande_latrine_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_latrine_pr.id,
                    objet: demande_latrine_pr.objet,
                    description:demande_latrine_pr.description,
                    ref_facture:demande_latrine_pr.ref_facture,
                    id_tranche_demande_latrine_pr: demande_latrine_pr.tranche.id ,
                    montant: demande_latrine_pr.montant,
                    cumul: demande_latrine_pr.cumul,
                    anterieur: demande_latrine_pr.anterieur ,
                    reste: demande_latrine_pr.reste ,
                    date: convertionDate(new Date(demande_latrine_pr.date)),
                    id_latrine_construction: demande_latrine_pr.latrine_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_latrine_pr = vm.alldemande_latrine_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_latrine_pr.id;
                });
              demande_latrine_pr.$selected = false;
              demande_latrine_pr.$edit = false;
              vm.selectedItemDemande_latrine_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
       
/**********************************fin demande_latrine_pr****************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_latrine_pr_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_latrine_pr = function ()
        { 
          if (NouvelItemPaiement_latrine_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement:'',
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_latrine_pr.push(items);
            vm.allpaiement_latrine_pr.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_latrine_pr = conv;
              }
            });

            NouvelItemPaiement_latrine_pr = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_latrine_pr(paiement_latrine_pr,suppression)
        {
            if (NouvelItemPaiement_latrine_pr==false)
            {
                test_existancePaiement_latrine_pr (paiement_latrine_pr,suppression); 
            } 
            else
            {
                insert_in_basePaiement_latrine_pr(paiement_latrine_pr,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_latrine_pr
        vm.annulerPaiement_latrine_pr = function(item)
        {
          if (NouvelItemPaiement_latrine_pr == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_latrine_pr.montant_paiement;
              item.observation    = currentItemPaiement_latrine_pr.observation;
              item.date_paiement = currentItemPaiement_latrine_pr.date_paiement; 
          }else
          {
            vm.allpaiement_latrine_pr = vm.allpaiement_latrine_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_latrine_pr.id;
            });
          }

          vm.selectedItemPaiement_latrine_pr = {} ;
          NouvelItemPaiement_latrine_pr      = false;
          
        };

        //fonction selection item paiement_latrine_pr convention cisco/feffi
        vm.selectionPaiement_latrine_pr = function (item)
        {
            vm.selectedItemPaiement_latrine_pr = item;
            currentItemPaiement_latrine_pr     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_latrine_pr));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_latrine_pr', function()
        {
             if (!vm.allpaiement_latrine_pr) return;
             vm.allpaiement_latrine_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_latrine_pr.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_latrine_pr = function(item)
        {
            NouvelItemPaiement_latrine_pr = false ;
            vm.selectedItemPaiement_latrine_pr = item;
            currentItemPaiement_latrine_pr = angular.copy(vm.selectedItemPaiement_latrine_pr);
            $scope.vm.allpaiement_latrine_pr.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_latrine_pr.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_latrine_pr.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_latrine_pr.date_paiement);
        };

        //fonction bouton suppression item paiement_latrine_pr convention cisco feffi
        vm.supprimerPaiement_latrine_pr = function()
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
                vm.ajoutPaiement_latrine_pr(vm.selectedItemPaiement_latrine_pr,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_latrine_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_latrine_pr.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_latrine_pr.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_latrine_pr.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_latrine_pr.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_latrine_pr.montant_paiement))                    
                      {
                          insert_in_basePaiement_latrine_pr(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_latrine_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_latrine_pr(paiement_latrine_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_latrine_pr ==false)
            {
                getId = vm.selectedItemPaiement_latrine_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_latrine_pr.montant_paiement,
                    observation: paiement_latrine_pr.observation,
                    date_paiement: convertionDate(new Date(paiement_latrine_pr.date_paiement)), 
                    id_demande_latrine_pr: vm.selectedItemDemande_latrine_pr.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_latrine_pr/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_latrine_pr == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_latrine_pr.$selected  = false;
                        vm.selectedItemPaiement_latrine_pr.$edit      = false;
                        vm.selectedItemPaiement_latrine_pr ={};
                    }
                    else 
                    {    
                      vm.allpaiement_latrine_pr = vm.allpaiement_latrine_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_latrine_pr.id;
                      });
                      vm.showbuttonNouvpaiement_latrine_pr = true;
                    }
                }
                else
                {
                  paiement_latrine_pr.id  =   String(data.response);              
                  NouvelItemPaiement_latrine_pr = false;

                  vm.showbuttonNouvPaiement_latrine_pr = false;
            }
              paiement_latrine_pr.$selected = false;
              paiement_latrine_pr.$edit = false;
              vm.selectedItemPaiement_latrine_pr = {};
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
