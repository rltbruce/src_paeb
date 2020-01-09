(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.suivi_daff_feffi')
        .controller('Suivi_daff_feffiController', Suivi_daff_feffiController)
        .controller('ConventionDialogController', ConventionDialogController);
    /** @ngInject */
    function Suivi_daff_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm    = this;

    //initialisation
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree          = false;

    //initialisation convention
        vm.selectedItemConvention = {} ;
        var currentItemConvention;
        var NouvelItemConvention    = false;
        vm.allconvention  = [] ;

     //initialisation demande_realimentation_feffi
      vm.ajoutDemande_realimentation  = ajoutDemande_realimentation ;
        var NouvelItemDemande_realimentation    = false;     
        var currentItemDemande_realimentation;
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ; 

    //initialisation transfert_feffi
        vm.ajoutTransfert_feffi  = ajoutTransfert_feffi ;
        var NouvelItemTransfert_feffi    = false;     
        var currentItemTransfert_feffi;
        vm.selectedItemTransfert_feffi = {} ;
        vm.alltransfert_feffi  = [] ; 

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };    
        
        //recuperation donnée programmation
        /*apiFactory.getAll("programmation/index").then(function(result)
        {
            vm.allprogrammation = result.data.response;
        });*/


  /*****************Debut StepOne convention***************/

  //recuperation donnée convention
        apiFactory.getAPIgeneraliserREST("convention/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention = result.data.response;
            console.log(vm.allconvention);
        });

        //col table
        vm.convention_column = [
        {titre:"Cisco"},
        {titre:"Association"},
        {titre:"Numero convention"},
        {titre:"Description"},        
        {titre:"Categorie ouvrage"},
        {titre:"Ouvrage"},
        {titre:"Montant prevu"},
        {titre:"Montant réel"},
        {titre:"Date"}];
        
        

        //fonction selection item convetion
        vm.selectionConvention = function (item)
        {
            vm.selectedItemConvention = item;
            currentItemConvention     = JSON.parse(JSON.stringify(vm.selectedItemConvention));
           // vm.allconvention= [] ;
           vm.stepOne = true;

           //recuperation donnée demande
          apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index",'menu','getdemande_realimentation_convention',"id_convention",item.id).then(function(result)
          {
              vm.alldemande_realimentation = result.data.response; 
              console.log(vm.alldemande_realimentation);
          });

           //recuperation donnée demande_realimentation_feffi
            apiFactory.getAPIgeneraliserREST("transfert_feffi/index",'menu','gettransfert_feffi_convention','id_convention',item.id).then(function(result)
            {
                vm.alltransfert_feffi = result.data.response;
                console.log(vm.alltransfert_feffi);
            }); 
        };
        $scope.$watch('vm.selectedItemConvention', function()
        {
             if (!vm.allconvention) return;
             vm.allconvention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention.$selected = true;

        });             

  /*****************Fin StepOne convention****************/
  

  /*****************Debut StepTwo demande_realimentation_feffi****************/

      vm.demande_realimentation_column = [
        {titre:"Libelle"},
        {titre:"Description"},
        {titre:"Date"},
        {titre:"Action"}];     
        

        //Masque de saisi ajout
        vm.ajouterDemande_realimentation = function ()
        { console.log('ee');
          if (NouvelItemDemande_realimentation == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              libelle: '',
              description: '',
              date: ''
            };         
            vm.alldemande_realimentation.push(items);
            vm.alldemande_realimentation.forEach(function(dem)
            {
              if(dem.$selected==true)
              {
                vm.selectedItemDemande_realimentation = dem;
              }
            });

            NouvelItemDemande_realimentation = true ;
          }else
          {
            vm.showAlert('Ajout demande_realimentation','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_realimentation(demande_realimentation,suppression)
        {
            if (NouvelItemDemande_realimentation==false)
            {
                test_existanceDemande_realimentation (demande_realimentation,suppression); 
            } 
            else
            {
                insert_in_baseDemande_realimentation(demande_realimentation,suppression);
            }
        }

        //fonction de bouton d'annulation demande_realimentation
        vm.annulerDemande_realimentation = function(item)
        {
          if (NouvelItemDemande_realimentation == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.libelle      = currentItemDemande_realimentation.libelle ;
            item.description = currentItemDemande_realimentation.description ;
            item.date        = currentItemDemande_realimentation.date ;  
          }else
          {
            vm.allDemande_realimentation = vm.allDemande_realimentation.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_realimentation.id;
            });
          }

          vm.selectedItemDemande_realimentation = {} ;
          NouvelItemDemande_realimentation      = false;
          
        };

        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            currentItemDemande_realimentation     = JSON.parse(JSON.stringify(vm.selectedItemDemande_realimentation));
           // vm.allconvention= [] ; 
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation) return;
             vm.alldemande_realimentation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierDemande_realimentation = function(item)
        {
            NouvelItemDemande_realimentation = false ;
            vm.selectedItemDemande_realimentation = item;
            currentItemDemande_realimentation = angular.copy(vm.selectedItemDemande_realimentation);
            $scope.vm.alldemande_realimentation.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.numero_convention = parseInt(vm.selectedItemDemande_realimentation.libelle) ;
            item.description       = vm.selectedItemDemande_realimentation.description ;
            item.date       = vm.selectedItemDemande_realimentation.date ;  
        };

        //fonction bouton suppression item convention
        vm.supprimerDemande_realimentation = function()
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
                vm.ajout(vm.selectedItemDemande_realimentation,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention
        function test_existanceDemande_realimentation (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_realimentation.filter(function(obj)
                {
                   return obj.id == currentItemDemande_realimentation.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItemDemande_realimentation.description) 
                    || (dema[0].libelle!=currentItemDemande_realimentation.libelle)
                    || (dema[0].date!=currentItemDemande_realimentation.date))                    
                      { 
                        insert_in_baseDemande_realimentation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_realimentation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseDemande_realimentation(demande_realimentation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_realimentation==false)
            {
                getId = vm.selectedItemDemande_realimentation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    libelle:  demande_realimentation.libelle,
                    description:   demande_realimentation.description,
                    date: convertionDate(new Date(demande_realimentation.date)),
                    id_convention:   vm.selectedItemConvention.id,
                    validation: 0               
                });
                //console.log(demande_realimentation.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                if (NouvelItemDemande_realimentation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_realimentation.libelle   = demande_realimentation.libelle;
                        vm.selectedItemDemande_realimentation.description      = demande_realimentation.description;
                        vm.selectedItemDemande_realimentation.date     = demande_realimentation.date;
                        vm.selectedItemDemande_realimentation.$selected  = false;
                        vm.selectedItemDemande_realimentation.$edit      = false;
                        vm.selectedItemDemande_realimentation ={};
                    }
                    else 
                    {    
                      vm.alldemande_realimentation = vm.alldemande_realimentation.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_realimentation.id;
                      });
                    }
                }
                else
                {
                  demande_realimentation.libelle   = demande_realimentation.libelle;
                  demande_realimentation.description      = demande_realimentation.description;
                  demande_realimentation.date     = demande_realimentation.date;
                  demande_realimentation.id  =   String(data.response);              
                  NouvelItemDemande_realimentation=false;
            }
              demande_realimentation.$selected = false;
              demande_realimentation.$edit = false;
              vm.selectedItemDemande_realimentation = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepTwo demande_realimentation_feffi****************/

  /*****************Fin StepThree transfert_feffi****************/

  vm.transfert_feffi_column = [
        {titre:"Code"},
        {titre:"Description"},
        {titre:"Montant"},
        {titre:"Numero facture"},
        {titre:"Date"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterTransfert_feffi = function ()
        { 
          if (NouvelItemTransfert_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              description: '',
              montant:'',
              num_facture:'',
              date: ''
            };         
            vm.alltransfert_feffi.push(items);
            vm.alltransfert_feffi.forEach(function(dem)
            {
              if(dem.$selected==true)
              {
                vm.selectedItemTransfert_feffi = dem;
              }
            });

            NouvelItemTransfert_feffi = true ;
          }else
          {
            vm.showAlert('Ajout transfert_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutTransfert_feffi(transfert_feffi,suppression)
        {
            if (NouvelItemTransfert_feffi==false)
            {
                test_existanceTransfert_feffi (transfert_feffi,suppression); 
            } 
            else
            {
                insert_in_baseTransfert_feffi(transfert_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation transfert_feffi
        vm.annulerTransfert_feffi = function(item)
        {
          if (NouvelItemTransfert_feffi == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.code      = currentItemTransfert_feffi.code ;
            item.description = currentItemTransfert_feffi.description ;
            item.montant     = currentItemTransfert_feffi.montant ;
            item.num_facture = currentItemTransfert_feffi.num_facture ;
            item.date        = currentItemTransfert_feffi.date ;  
          }else
          {
            vm.alltransfert_feffi = vm.alltransfert_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemTransfert_feffi.id;
            });
          }

          vm.selectedItemTransfert_feffi = {} ;
          NouvelItemTransfert_feffi      = false;
          
        };

        //fonction selection item transfert_feffi
        vm.selectionTransfert_feffi= function (item)
        {
            vm.selectedItemTransfert_feffi = item;
            currentItemTransfert_feffi     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_feffi));
           // vm.allconvention= [] ; 
        };
        $scope.$watch('vm.selectedItemTransfert_feffi', function()
        {
             if (!vm.alltransfert_feffi) return;
             vm.alltransfert_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_feffi.$selected = true;
        });

        //fonction masque de saisie modification item transfert_feffi
        vm.modifierTransfert_feffi = function(item)
        {
            NouvelItemTransfert_feffi = false ;
            vm.selectedItemTransfert_feffi = item;
            currentItemTransfert_feffi = angular.copy(vm.selectedItemTransfert_feffi);
            $scope.vm.alltransfert_feffi.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.code = vm.selectedItemTransfert_feffi.code ;
            item.description = vm.selectedItemTransfert_feffi.description ;
            item.montant = vm.selectedItemTransfert_feffi.montant ;
            item.num_facture = vm.selectedItemTransfert_feffi.num_facture ;
            item.date       = vm.selectedItemTransfert_feffi.date ;  
        };

        //fonction bouton suppression item transfert_feffi
        vm.supprimerTransfert_feffi = function()
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
                vm.ajoutTransfert_feffi(vm.selectedItemTransfert_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention
        function test_existanceTransfert_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alltransfert_feffi.filter(function(obj)
                {
                   return obj.id == currentItemTransfert_feffi.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItemTransfert_feffi.description) 
                    || (dema[0].code!=currentItemTransfert_feffi.code)
                    || (dema[0].num_facture!=currentItemTransfert_feffi.num_facture)
                    || (dema[0].montant!=currentItemTransfert_feffi.montant)
                    || (dema[0].date!=currentItemTransfert_feffi.date))                    
                      { 
                        insert_in_baseTransfert_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTransfert_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd transfert_feffi
        function insert_in_baseTransfert_feffi(transfert_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTransfert_feffi==false)
            {
                getId = vm.selectedItemTransfert_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:         transfert_feffi.code,
                    description:  transfert_feffi.description,
                    montant:      transfert_feffi.montant,
                    num_facture:  transfert_feffi.num_facture,
                    date: convertionDate(new Date(transfert_feffi.date)),
                    id_convention:   vm.selectedItemConvention.id,
                    validation: 0               
                });
                //console.log(demande_deblocage.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("transfert_feffi/index",datas, config).success(function (data)
            {
                if (NouvelItemTransfert_feffi == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTransfert_feffi.code   = transfert_feffi.code;
                        vm.selectedItemTransfert_feffi.description = transfert_feffi.description;
                        vm.selectedItemTransfert_feffi.montant     = transfert_feffi.montant;
                        vm.selectedItemTransfert_feffi.num_facture = transfert_feffi.num_facture;
                        vm.selectedItemTransfert_feffi.date     = transfert_feffi.date;
                        vm.selectedItemTransfert_feffi.$selected  = false;
                        vm.selectedItemTransfert_feffi.$edit      = false;
                        vm.selectedItemTransfert_feffi ={};
                    }
                    else 
                    {    
                      vm.alltransfert_feffi = vm.alltransfert_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTransfert_feffi.id;
                      });
                    }
                }
                else
                {
                  transfert_feffi.code   = transfert_feffi.code;
                  transfert_feffi.description = transfert_feffi.description;
                  transfert_feffi.montant     = transfert_feffi.montant;
                  transfert_feffi.num_facture = transfert_feffi.num_facture;
                  transfert_feffi.date        = transfert_feffi.date;
                  transfert_feffi.id  =   String(data.response);              
                  NouvelItemTransfert_feffi=false;
                }
              transfert_feffi.$selected = false;
              transfert_feffi.$edit = false;
              vm.selectedItemTransfert_feffi = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepThree transfert_feffi****************/ 
        

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
    }


/*****************Debut ConventionDialogue Controlleur  ****************/    
    function ConventionDialogController($mdDialog, $scope, apiFactory, $state)
    { 
        var dg=$scope;
        dg.affichebuttonAjouter = false;
        dg.selectedItemConventionDialog = {};
        var currentItemConventionDialog;
        var nouvelItemConventionDialog = false;
        dg.allconventionDialog = [];

        dg.conventiondialog_column = [
        {titre:"Cisco"},
        {titre:"Association"},
        {titre:"Numero convention"},
        {titre:"Description"},        
        {titre:"Categorie ouvrage"},
        {titre:"Ouvrage"},
        {titre:"Montant prevu"},
        {titre:"Montant réel"},
        {titre:"Date"}];

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getAPIgeneraliserREST("convention/index",'menu','getconventioninvalide').then(function(result)
        {dg.allconventionDialog = result.data.response;});

        dg.cancel = function()
        {
          $mdDialog.cancel();
          dg.affichebuttonAjouter = false;
        };

        dg.dialognouveauajout = function(conven)
        {  
            $mdDialog.hide(dg.selectedItemConventionDialog);
            dg.affichebuttonAjouter = false;
        }

        //format date affichage sur datatable
        dg.formatDate = function (daty)
        {
            if (daty) 
            {
                var date  = new Date(daty);
                var mois  = date.getMonth()+1;
                var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
                return dates;
            }           

        }

        //fonction selection item convetion
        dg.selectionConventionDialog = function (item)
        {
            dg.selectedItemConventionDialog  = item;
            dg.affichebuttonAjouter = true;               
        };
        
        $scope.$watch('selectedItemConventionDialog', function()
        {
            if (!dg.allconventionDialog) return;
              dg.allconventionDialog.forEach(function(iteme)
              {
                  iteme.$selected = false;
              });
            dg.selectedItemConventionDialog.$selected = true;
        });

    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
