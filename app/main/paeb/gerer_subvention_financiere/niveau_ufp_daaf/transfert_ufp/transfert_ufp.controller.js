(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.transfert_ufp')
        .controller('Transfert_ufpController', Transfert_ufpController)
    /** @ngInject */
    function Transfert_ufpController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,apiUrlFile)
    {
		    var vm    = this;

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;

     //initialisation demande_deblocage_daaf_validation_ufp
        vm.selectedItemDemande_deblocage_daaf_valide = {} ;
        vm.alldemande_deblocage_daaf_valide_daaf  = [] ;

        var NouvelItemTransfert_ufp = false;
        var currentItemTransfert_ufp;
        vm.selectedItemTransfert_ufp = {} ;
        vm.ajoutTransfert_ufp  = ajoutTransfert_ufp ;
        vm.alltransfert_ufp = [] ;
        vm.showbuttonNouvtransfert= true;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf_invalide","validation",3).then(function(result)
        {
            vm.alldemande_deblocage_daaf_valide_daaf = result.data.response;
            
        });

  /*****************Debut StepTwo demande_deblocage_daaf_validation_ufp****************/

      vm.demande_deblocage_daaf_valide_column = [
        {titre:"Réference convention"},
        {titre:"Réference demande"},
        {titre:"Objet"},       
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Numero compte"},
        {titre:"Date"},
        //{titre:"Situation"},
        {titre:"Action"}];        

        //fonction selection item region
        vm.selectionDemande_deblocage_daaf_validation_ufp= function (item)
        {
            vm.selectedItemDemande_deblocage_daaf_valide = item;
           //recuperation donnée demande_deblocage_daaf_validation_ufp
            apiFactory.getAPIgeneraliserREST("transfert_ufp/index",'id_demande_deblocage_daaf',item.id).then(function(result)
            {
                vm.alltransfert_ufp = result.data.response;
                if (vm.alltransfert_ufp.length >0)
                {
                  vm.showbuttonNouvtransfert= false;
                }
            });
            vm.stepOne = true;
            vm.stepTwo = false;

        };
        $scope.$watch('vm.selectedItemDemande_deblocage_daaf_valide', function()
        {
             if (!vm.alldemande_deblocage_daaf_valide_daaf) return;
             vm.alldemande_deblocage_daaf_valide_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage_daaf_valide.$selected = true;
        });

      /*  vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Emise';                  
                  break;
              
              case '2':
                        return 'En cours de traitement'; 
                  break;

              case '3':
                  
                  return 'Finalisée'; 
                  break;

             case '4':
                  
                  return 'Rejeté'; 
                  break;

              default:
          
            }
        }*/

  /*****************Fin StepTwo demande_deblocage_daaf_validation_ufp****************/

/****************************Debut stepTwo Transfert ufp******************************/
//col table
        vm.transfert_ufp_column = [        
        {titre:"Montant transféré"},        
        {titre:"Frais bancaire"},
        {titre:"Montant total"},
        {titre:"Date"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterTransfert_ufp = function ()
        { 
          if (NouvelItemTransfert_ufp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_transfert: parseInt(vm.selectedItemDemande_deblocage_daaf_valide.prevu),
              frais_bancaire:'',
              montant_total:'',
              date:'',
              observation:''
            };         
            vm.alltransfert_ufp.push(items);
            vm.alltransfert_ufp.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemTransfert_ufp = conv;
              }
            });

            NouvelItemTransfert_ufp = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutTransfert_ufp(transfert_ufp,suppression)
        {
            if (NouvelItemTransfert_ufp==false)
            {
                test_existanceTransfert_ufp (transfert_ufp,suppression); 
            } 
            else
            {
                insert_in_baseTransfert_ufp(transfert_ufp,suppression);
            }
        }

        //fonction de bouton d'annulation transfert_ufp
        vm.annulerTransfert_ufp = function(item)
        {
          if (NouvelItemTransfert_ufp == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_transfert = currentItemTransfert_ufp.montant_transfert;
              item.frais_bancaire = currentItemTransfert_ufp.frais_bancaire;
              item.montant_total = currentItemTransfert_ufp.montant_total;
              item.date = currentItemTransfert_ufp.date;
              item.observation    = currentItemTransfert_ufp.observation;
          }else
          {
            vm.alltransfert_ufp = vm.alltransfert_ufp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemTransfert_ufp.id;
            });
          }

          vm.selectedItemTransfert_ufp = {} ;
          NouvelItemTransfert_ufp      = false;
          
        };

        //fonction selection item transfert_ufp convention cisco/feffi
        vm.selectionTransfert_ufp = function (item)
        {
            vm.selectedItemTransfert_ufp = item;
            currentItemTransfert_ufp     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_ufp));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemTransfert_ufp', function()
        {
             if (!vm.alltransfert_ufp) return;
             vm.alltransfert_ufp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_ufp.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierTransfert_ufp = function(item)
        {
            NouvelItemTransfert_ufp = false ;
            vm.selectedItemTransfert_ufp = item;
            currentItemTransfert_ufp = angular.copy(vm.selectedItemTransfert_ufp);
            $scope.vm.alltransfert_ufp.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_transfert = parseInt(vm.selectedItemTransfert_ufp.montant_transfert) ;
            item.frais_bancaire = parseInt(vm.selectedItemTransfert_ufp.frais_bancaire) ;
            item.montant_total = parseInt(vm.selectedItemTransfert_ufp.montant_total );
            item.observation = vm.selectedItemTransfert_ufp.observation ;
            item.date = new Date(vm.selectedItemTransfert_ufp.date);
        };

        //fonction bouton suppression item transfert_ufp convention cisco feffi
        vm.supprimerTransfert_ufp = function()
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
                vm.ajoutTransfert_ufp(vm.selectedItemTransfert_ufp,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceTransfert_ufp (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.alltransfert_ufp.filter(function(obj)
                {
                   return obj.id == currentItemTransfert_ufp.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemTransfert_ufp.observation)
                    || (convT[0].date!=currentItemTransfert_ufp.date)
                    || (convT[0].montant_transfert!=currentItemTransfert_ufp.montant_transfert)
                    || (convT[0].frais_bancaire!=currentItemTransfert_ufp.frais_bancaire)
                    || (convT[0].montant_total!=currentItemTransfert_ufp.montant_total))                    
                      {
                          insert_in_baseTransfert_ufp(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTransfert_ufp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseTransfert_ufp(transfert_ufp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTransfert_ufp ==false)
            {
                getId = vm.selectedItemTransfert_ufp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    montant_transfert:    transfert_ufp.montant_transfert,
                    frais_bancaire:    transfert_ufp.frais_bancaire,
                    montant_total: transfert_ufp.montant_total,
                    observation: transfert_ufp.observation,
                    date: convertionDate(new Date(transfert_ufp.date)), 
                    id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf_valide.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("transfert_ufp/index",datas, config).success(function (data)
            {

                if (NouvelItemTransfert_ufp == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTransfert_ufp.$selected  = false;
                        vm.selectedItemTransfert_ufp.$edit      = false;
                        vm.selectedItemTransfert_ufp ={};
                    }
                    else 
                    {    
                      vm.alltransfert_ufp = vm.alltransfert_ufp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTransfert_ufp.id;
                      });
                      vm.showbuttonNouvtransfert= true;
                      //vm.showbuttonNouvtransfert_ufp = true;
                    }
                }
                else
                {
                  transfert_ufp.id  =   String(data.response);              
                  NouvelItemTransfert_ufp = false;
                  vm.showbuttonNouvtransfert= false;

                  //vm.showbuttonNouvtransfert_ufp = false;
            }
              transfert_ufp.$selected = false;
              transfert_ufp.$edit = false;
              vm.selectedItemTransfert_ufp = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }
        vm.changeFraibancaire = function(item)
        {
          item.montant_total = parseInt(item.montant_transfert) + parseInt(item.frais_bancaire);
        }


  /*****************Fin StepThree Transfert ufp****************/ 
        

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

        //format date affichage sur datatable
        vm.formatDate = function (daty)
        {
          if (daty) 
          {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

        }

        //convertion date au format AAAA-MM-JJ
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
