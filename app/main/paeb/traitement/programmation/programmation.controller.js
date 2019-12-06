(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.programmation')
        .controller('ProgrammationController', ProgrammationController)
        .controller('ConventionDialogController', ConventionDialogController);
    /** @ngInject */
    function ProgrammationController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm    = this;

    //initialisation programmation  
        vm.ajoutProgrammation  = ajoutProgrammation ;
        var NouvelItemProgrammation    = false;
        var currentItemProgrammation;
        vm.selectedItemProgrammation      = {} ;
        vm.allprogrammation  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepTree          = false;

    //initialisation convention
        vm.selectedItemConvention = {} ;
        var currentItemConvention;
        var NouvelItemConvention    = false;
        vm.allconvention  = [] ;

     //initialisation demande_deblocage_daff
      vm.ajoutDemande_deblocage  = ajoutDemande_deblocage ;
        var NouvelItemDemande_deblocage    = false;     
        var currentItemDemande_deblocage;
        vm.selectedItemDemande_deblocage = {} ;
        vm.alldemande_deblocage  = [] ;    

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

/*****************Debut StepOne programme****************/

  //col table
        vm.programmation_column = [        
        {titre:"Description"},
        {titre:"Montant total prevu"},
        {titre:"Date"},
        {titre:"Action"}];

  //recuperation donnée programmation
        apiFactory.getAll("programmation/index").then(function(result)
        {
            vm.allprogrammation = result.data.response;
        });

      //Masque de saisi ajout
        vm.ajouterProgrammation = function ()
        { 
          if (NouvelItemProgrammation == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              description: '',              
              montant_total_prevu: '',
              date: ''
            };         
            vm.allprogrammation.push(items);
            vm.allprogrammation.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemProgrammation = conv;
              }
            });

            NouvelItemProgrammation = true ;
          }else
          {
            vm.showAlert('Ajout programmation','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutProgrammation(programmation,suppression)
        {
            if (NouvelItemProgrammation==false)
            {
                test_existanceProgrammation (programmation,suppression); 
            } 
            else
            {
                insert_in_baseProgrammation(programmation,suppression);
            }
        }

        //fonction de bouton d'annulation programmation
        vm.annulerProgrammation = function(item)
        {
          if (NouvelItemProgrammation == false)
          {
            item.$edit = false;
            item.$selected = false;
             item.description       = currentItemProgrammation.description ;            
            item.montant_total_prevu      = currentItemProgrammation.montant_total_prevu ;
            item.date       = currentItemProgrammation.date ;  
          }
          else
          {
            vm.allprogrammation = vm.allprogrammation.filter(function(obj)
            {
                return obj.id !== vm.selectedItemProgrammation.id;
            });
          }

          vm.selectedItemProgrammation = {} ;
          NouvelItemProgrammation      = false;
          
        };

        //fonction selection item region
        vm.selectionProgrammation= function (item)
        {
            vm.selectedItemProgrammation = item;
            currentItemProgrammation     = JSON.parse(JSON.stringify(vm.selectedItemProgrammation));
           // vm.allprogrammation= [] ;
           vm.stepOne = true;

           //recuperation donnée convention
        apiFactory.getAPIgeneraliserREST("convention/index",'menu','getconventionvalide','id_programmation',vm.selectedItemProgrammation.id,'validation','1').then(function(result)
        {
            vm.allconvention = result.data.response;
            console.log(vm.allconvention);
        }); 
        };
        $scope.$watch('vm.selectedItemProgrammation', function()
        {
             if (!vm.allprogrammation) return;
             vm.allprogrammation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemProgrammation.$selected = true;
        });

        //fonction masque de saisie modification item programmation
        vm.modifierProgrammation = function(item)
        {
            NouvelItemProgrammation = false ;
            vm.selectedItemProgrammation = item;
            currentItemProgrammation = angular.copy(vm.selectedItem);
            $scope.vm.allprogrammation.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.description        = vm.selectedItemProgrammation.description ;            
            item.montant_total_prevu      = vm.selectedItemProgrammation.montant_total_prevu ;
            item.date       = vm.selectedItemProgrammation.date ;  
        };

        //fonction bouton suppression item programmation
        vm.supprimerProgrammation = function()
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
                vm.ajoutProgrammation(vm.selectedItemProgrammation,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item programmation
        function test_existanceProgrammation (item,suppression)
        {          
            if (suppression!=1)
            {
               var conv = vm.allprogrammation.filter(function(obj)
                {
                   return obj.id == currentItemProgrammation.id;
                });
                if(conv[0])
                {
                   if((conv[0].description!=currentItemProgrammation.description)
                    || (conv[0].montant_total_prevu!=currentItemProgrammation.montant_total_prevu)
                    || (conv[0].date!=currentItemProgrammation.date))                    
                      { 
                        insert_in_baseProgrammation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseProgrammation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd programmation
        function insert_in_baseProgrammation(programmation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemProgrammation==false)
            {
                getId = vm.selectedItemProgrammation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description:   programmation.description,
                    montant_total_prevu: programmation.montant_total_prevu,
                    date: convertionDate(new Date(programmation.date))               
                });
                //console.log(programmation.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("programmation/index",datas, config).success(function (data)
            {
               
                if (NouvelItemProgrammation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemProgrammation.description      = programmation.description;
                        vm.selectedItemProgrammation.montant_total_prevu    = programmation.montant_total_prevu;
                        vm.selectedItemProgrammation.date     = programmation.date;
                        vm.selectedItemProgrammation.$selected  = false;
                        vm.selectedItemProgrammation.$edit      = false;
                        vm.selectedItemProgrammation ={};
                    }
                    else 
                    {    
                      vm.allprogrammation = vm.allprogrammation.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemProgrammation.id;
                      });
                    }
                }
                else
                {
                 
                  programmation.description      = programmation.description;
                  //programmation.cisco         = cis[0];;
                  programmation.montant_total_prevu    = programmation.montant_total_prevu;
                  programmation.date     = programmation.date;
                  programmation.id  =   String(data.response);              
                  NouvelItemProgrammation=false;
            }
              programmation.$selected = false;
              programmation.$edit = false;
              vm.selectedItemProgrammation = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepOne programme****************/


  /*****************Debut StepTwo convention***************/

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

        vm.ajoutConventionDialog = function (ev)
        {
          console.log('to');

          var confirm = $mdDialog.confirm({
          controller: ConventionDialogController,
          templateUrl: 'app/main/paeb/traitement/programmation/conventiondialog.html',
          parent: angular.element(document.body),
          targetEvent: ev, 
          
          })

              $mdDialog.show(confirm).then(function(data)
              {
               console.log(data);
               insert_in_base_convention(data,'0')
              }, function(){//alert('rien');
            });

        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_base_convention(convention,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var validation = 1;
            var datas = $.param({
                    supprimer: suppression,
                    id:        convention.id,      
                    numero_convention:  convention.numero_convention,
                    description:   convention.description,
                    id_cisco:      convention.cisco.id,
                    id_association: convention.association.id,
                    id_categorie_ouvrage: convention.categorie_ouvrage.id,
                    id_ouvrage:    convention.ouvrage.id,
                    montant_reel:  convention.montant_reel,
                    montant_prevu: convention.montant_prevu,
                    id_programmation: vm.selectedItemProgrammation.id ,
                    validation: validation,
                    date: convertionDate(new Date(convention.date))               
                });
                //console.log(convention.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("convention/index",datas, config).success(function (data)
            {
                if (suppression==1)
                {    
                    vm.allconvention = vm.allconvention.filter(function(obj)
                    {
                        return obj.id !== vm.selectedItem.id;
                    });
                    
                }
                else
                { 
                  var item =
                  {
                      numero_convention: convention.numero_convention,
                      description      : convention.description,
                      cisco         : convention.cisco,
                      association   : convention.association,
                      categorie_ouvrage  : convention.categorie_ouvrage,
                      ouvrage       : convention.ouvrage,
                      montant_prevu : convention.montant_prevu,
                      montant_reel  : convention.montant_reel,
                      date     : convention.date,
                      id  :  convention.id,
                      validation  :  validation,
                      id_programmation  :  vm.selectedItemProgrammation.id, 
                  }
                  vm.allconvention.push(item);             
                  console.log(vm.allconvention);
                }
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }              

  /*****************Fin StepTwo convention****************/

  /*****************Debut StepThree demande_deblocage_daff****************/

      vm.demande_deblocage_column = [
        {titre:"Code"},
        {titre:"Description"},
        {titre:"Date"},
        {titre:"Action"}];
        
        //recuperation donnée convention
        apiFactory.getAll("demande_deblocage_daaf/index").then(function(result)
        {
            vm.alldemande_deblocage = result.data.response; 
            console.log(vm.alldemande_deblocage);
        });

        //Masque de saisi ajout
        vm.ajouterDemande_deblocage = function ()
        { console.log('ee');
          if (NouvelItemDemande_deblocage == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              description: '',
              date: ''
            };         
            vm.alldemande_deblocage.push(items);
            vm.alldemande_deblocage.forEach(function(dem)
            {
              if(dem.$selected==true)
              {
                vm.selectedItemDemande_deblocage = dem;
              }
            });

            NouvelItemDemande_deblocage = true ;
          }else
          {
            vm.showAlert('Ajout demande_deblocage','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_deblocage(demande_deblocage,suppression)
        {
            if (NouvelItemDemande_deblocage==false)
            {
                test_existanceDemande_deblocage (demande_deblocage,suppression); 
            } 
            else
            {
                insert_in_baseDemande_deblocage(demande_deblocage,suppression);
            }
        }

        //fonction de bouton d'annulation demande_deblocage
        vm.annulerDemande_deblocage = function(item)
        {
          if (NouvelItemDemande_deblocage == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.code      = currentItemDemande_deblocage.code ;
            item.description = currentItemDemande_deblocage.description ;
            item.date        = currentItemDemande_deblocage.date ;  
          }else
          {
            vm.allDemande_deblocage = vm.allDemande_deblocage.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_deblocage.id;
            });
          }

          vm.selectedItemDemande_deblocage = {} ;
          NouvelItemDemande_deblocage      = false;
          
        };

        //fonction selection item region
        vm.selectionDemande_deblocage= function (item)
        {
            vm.selectedItemDemande_deblocage = item;
            vm.NouvelItemDemande_deblocage   = item;
            currentItemDemande_deblocage     = JSON.parse(JSON.stringify(vm.selectedItemDemande_deblocage));
           // vm.allconvention= [] ; 
        };
        $scope.$watch('vm.selectedItemDemande_deblocage', function()
        {
             if (!vm.alldemande_deblocage) return;
             vm.alldemande_deblocage.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierDemande_deblocage = function(item)
        {
            NouvelItemDemande_deblocage = false ;
            vm.selectedItemDemande_deblocage = item;
            currentItemDemande_deblocage = angular.copy(vm.selectedItem);
            $scope.vm.alldemande_deblocage.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.numero_convention = parseInt(vm.selectedItemDemande_deblocage.code) ;
            item.description       = vm.selectedItemDemande_deblocage.description ;
            item.date       = vm.selectedItem.date ;  
        };

        //fonction bouton suppression item convention
        vm.supprimerDemande_deblocage = function()
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
                vm.ajout(vm.selectedItemDemande_deblocage,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention
        function test_existanceDemande_deblocage (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_deblocage.filter(function(obj)
                {
                   return obj.id == currentItemDemande_deblocage.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItem.description) 
                    || (dema[0].code!=currentItem.code)
                    || (dema[0].date!=currentItem.date))                    
                      { 
                        insert_in_baseDemande_deblocage(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_deblocage(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseDemande_deblocage(demande_deblocage,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_deblocage==false)
            {
                getId = vm.selectedItemDemande_deblocage.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:  demande_deblocage.code,
                    description:   demande_deblocage.description,
                    date: convertionDate(new Date(demande_deblocage.date)),
                    id_programmation:   vm.selectedItemProgrammation.id,
                    validation: 0               
                });
                //console.log(demande_deblocage.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {
                if (NouvelItemDemande_deblocage == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_deblocage.code   = demande_deblocage.code;
                        vm.selectedItemDemande_deblocage.description      = demande_deblocage.description;
                        vm.selectedItemDemande_deblocage.date     = demande_deblocage.date;
                        vm.selectedItemDemande_deblocage.$selected  = false;
                        vm.selectedItemDemande_deblocage.$edit      = false;
                        vm.selectedItemDemande_deblocage ={};
                    }
                    else 
                    {    
                      vm.alldemande_deblocage = vm.alldemande_deblocage.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_deblocage.id;
                      });
                    }
                }
                else
                {
                  demande_deblocage.code   = demande_deblocage.code;
                  demande_deblocage.description      = demande_deblocage.description;
                  demande_deblocage.date     = demande_deblocage.date;
                  demande_deblocage.id  =   String(data.response);              
                  NouvelItemDemande_deblocage=false;
            }
              demande_deblocage.$selected = false;
              demande_deblocage.$edit = false;
              vm.selectedItemDemande_deblocage = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepThree demande_deblocage_daff****************/
        

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
