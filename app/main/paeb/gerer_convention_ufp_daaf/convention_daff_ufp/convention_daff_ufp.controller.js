(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.convention_daff_ufp')
        .controller('Convention_daff_ufpController', Convention_daff_ufpController)
        .controller('ConventionDialogController', ConventionDialogController);
    /** @ngInject */
    function Convention_daff_ufpController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;

    //initialisation programmation  
        vm.ajoutConvention_daff_ufp = ajoutConvention_daff_ufp ;
        var NouvelItemConvention_daff_ufp = false;
        var currentItemConvention_daff_ufp;
        vm.selectedItemConvention_daff_ufp = {} ;
        vm.allconvention_daff_ufp  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;

    //initialisation convention
        vm.selectedItemConvention_cisco_feffi = {} ;
        var currentItemConvention_cisco_feffi;
        var NouvelItemConvention_cisco_feffi = false;
        vm.allconvention_cisco_feffi = [] ;

        vm.date_now = new Date();     

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/*****************Debut StepOne convention_daff_ufp****************/

  //col table
        vm.convention_daff_ufp_column = [        
        {titre:"Objet"},
        {titre:"Numero convention"},
        {titre:"Montant estime"},
        {titre:"Date"},
        {titre:"Action"}];

  //recuperation donnée programmation
        apiFactory.getAll("convention_daff_ufp/index").then(function(result)
        {
            vm.allconvention_daff_ufp = result.data.response;
        });

      //Masque de saisi ajout
        vm.ajouterConvention_daff_ufp = function ()
        { 
          if (NouvelItemConvention_daff_ufp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              objet: '',              
              numero_convention: '',
              montant_estime: '',
              date_signature: ''
            };         
            vm.allconvention_daff_ufp.push(items);
            vm.allconvention_daff_ufp.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemConvention_daff_ufp = conv;
              }
            });

            NouvelItemConvention_daff_ufp = true ;
          }else
          {
            vm.showAlert('Ajout convention_daff_ufp','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutConvention_daff_ufp(convention_daff_ufp,suppression)
        {
            if (NouvelItemConvention_daff_ufp==false)
            {
                test_existanceConvention_daff_ufp (convention_daff_ufp,suppression); 
            } 
            else
            {
                insert_in_baseConvention_daff_ufp(convention_daff_ufp,suppression);
            }
        }

        //fonction de bouton d'annulation convention_daff_ufp
        vm.annulerConvention_daff_ufp = function(item)
        {
          if (NouvelItemConvention_daff_ufp == false)
          {
            item.$edit = false;
            item.$selected = false;

            item.objet = currentItemConvention_daff_ufp.objet;            
            item.montant_estime = currentItemConvention_daff_ufp.montant_estime ;
            item.date_signature = currentItemConvention_daff_ufp.date_signature ;
            item.numero_convention = currentItemConvention_daff_ufp.numero_convention ;  
          }
          else
          {
            vm.allconvention_daff_ufp = vm.allconvention_daff_ufp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemConvention_daff_ufp.id;
            });
          }
          NouvelItemConvention_daff_ufp      = false;
          vm.selectedItemConvention_daff_ufp = {} ;
          
        };

        //fonction selection item region
        vm.selectionConvention_daff_ufp= function (item)
        {
            vm.selectedItemConvention_daff_ufp = item;
            currentItemConvention_daff_ufp     = JSON.parse(JSON.stringify(vm.selectedItemConvention_daff_ufp));
           // vm.allconvention_daff_ufp= [] ;
            vm.stepOne = true;
            vm.stepTwo = true;
           if (vm.selectedItemConvention_daff_ufp.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_daff_ufp.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi = result.data.response;                  
              });
           }
        };
        $scope.$watch('vm.selectedItemConvention_daff_ufp', function()
        {
            if (!vm.allconvention_daff_ufp) return;
            vm.allconvention_daff_ufp.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_daff_ufp.$selected = true;
        });

        //fonction masque de saisie modification item convention_daff_ufp
        vm.modifierConvention_daff_ufp = function(item)
        {
            NouvelItemConvention_daff_ufp = false ;
            vm.selectedItemConvention_daff_ufp = item;
            currentItemConvention_daff_ufp = angular.copy(vm.selectedItemItemConvention_daff_ufp);
            $scope.vm.allconvention_daff_ufp.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.objet = vm.selectedItemConvention_daff_ufp.objet ;            
            item.montant_estime = parseInt(vm.selectedItemConvention_daff_ufp.montant_estime) ;
            item.date_signature = vm.selectedItemConvention_daff_ufp.date_signature ;
            item.numero_convention = parseInt(vm.selectedItemConvention_daff_ufp.numero_convention) ;  
        };

        //fonction bouton suppression item convention_daff_ufp
        vm.supprimerConvention_daff_ufp = function()
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
                vm.ajoutConvention_daff_ufp(vm.selectedItemConvention_daff_ufp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_daff_ufp
        function test_existanceConvention_daff_ufp (item,suppression)
        {          
            if (suppression!=1)
            {
               var conv = vm.allconvention_daff_ufp.filter(function(obj)
                {
                   return obj.id == currentItemConvention_daff_ufp.id;
                });
                if(conv[0])
                {
                   if((conv[0].objet!=currentItemConvention_daff_ufp.objet)
                    || (conv[0].montant_estime!=currentItemConvention_daff_ufp.montant_estime)
                    || (conv[0].numero_convention!=currentItemConvention_daff_ufp.numero_convention)
                    || (conv[0].date_signature!=currentItemConvention_daff_ufp.date_signature))                    
                      { 
                        insert_in_baseConvention_daff_ufp(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseConvention_daff_ufp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_daff_ufp
        function insert_in_baseConvention_daff_ufp(convention_daff_ufp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_daff_ufp==false)
            {
                getId = vm.selectedItemConvention_daff_ufp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet:   convention_daff_ufp.objet,
                    montant_estime: convention_daff_ufp.montant_estime,
                    numero_convention: convention_daff_ufp.numero_convention,
                    date_signature: convertionDate(new Date(convention_daff_ufp.date_signature))               
                });
                //factory
            apiFactory.add("convention_daff_ufp/index",datas, config).success(function (data)
            {
               
                if (NouvelItemConvention_daff_ufp == false)
                {
                    // Update_signature or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemConvention_daff_ufp.objet = convention_daff_ufp.objet;
                        vm.selectedItemConvention_daff_ufp.montant_estime = convention_daff_ufp.montant_estime;
                        vm.selectedItemConvention_daff_ufp.date_signature = convention_daff_ufp.date_signature;
                        vm.selectedItemConvention_daff_ufp.numero_convention = convention_daff_ufp.numero_convention;
                        vm.selectedItemConvention_daff_ufp.$selected = false;
                        vm.selectedItemConvention_daff_ufp.$edit     = false;
                        vm.selectedItemConvention_daff_ufp ={};
                    }
                    else 
                    {    
                      vm.allconvention_daff_ufp = vm.allconvention_daff_ufp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemConvention_daff_ufp.id;
                      });
                    }
                }
                else
                {
                 
                  convention_daff_ufp.objet = convention_daff_ufp.objet;
                  convention_daff_ufp.montant_estime = convention_daff_ufp.montant_estime;
                  convention_daff_ufp.date_signature = convention_daff_ufp.date_signature;
                  convention_daff_ufp.numero_convention = convention_daff_ufp.numero_convention;
                  convention_daff_ufp.id = String(data.response);              
                  NouvelItemConvention_daff_ufp = false;
            }
              convention_daff_ufp.$selected = false;
              convention_daff_ufp.$edit = false;
              vm.selectedItemConvention_daff_ufp = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepOne convention_daff_ufp****************/


  /*****************Debut StepTwo convention***************/

        //col table
        vm.convention_cisco_feffi_column = [
        {titre:"Cisco"},
        {titre:"Feffi"},
        {titre:"Numero convention"},
        {titre:"Objet"},        
        {titre:"Financement"},
        {titre:"Delai"},
        {titre:"Date signature"},
        {titre:"Action"}];
        
        

        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi = function (item)
        {
            vm.selectedItemConvention_cisco_feffi = item;
            currentItemConvention_cisco_feffi     = JSON.parse(JSON.stringify(vm.selectedItemConvention_cisco_feffi));
           // vm.allconvention= [] ;
           vm.stepOne = true;
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi', function()
        {
             if (!vm.allconvention_cisco_feffi) return;
             vm.allconvention_cisco_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi.$selected = true;

        });

        //fonction bouton suppression de l'item convention_cisco_feefi
        vm.supprimerConvention_cisco_feffi = function()
        {
            var confirm = $mdDialog.confirm()
                    .title("Etes-vous sûr d'enlever cet enregistrement ?")
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                insert_in_base_convention_cisco_feffi(vm.selectedItemConvention_cisco_feffi,0,0);
                console.log(vm.selectedItemConvention_cisco_feffi);
                //recuperation donnée convention detail
                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',vm.selectedItemConvention_cisco_feffi.id).then(function(result)
                {
                    var convention_cife_detail = result.data.response;
                    //console.log(convention_cife_detail[0]);
                    var montant = parseInt(vm.selectedItemConvention_daff_ufp.montant_estime) - parseInt(convention_cife_detail[0].montant_total);
                    miseajourconvention_daff_ufp(vm.selectedItemConvention_daff_ufp,'0',montant);
                });
              }, function() {
                //alert('rien');
              });
        };

        vm.ajoutConventionDialog = function (ev)
        {
          NouvelItemConvention_cisco_feffi = true;
          var confirm = $mdDialog.confirm({
          controller: ConventionDialogController,
          templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/convention_daff_ufp/conventiondialog.html',
          parent: angular.element(document.body),
          targetEvent: ev, 
          
          })

              $mdDialog.show(confirm).then(function(data)
              {
               
               insert_in_base_convention_cisco_feffi(data,'0',1);

               //recuperation donnée convention detail
                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',data.id).then(function(result)
                {
                    var convention_cife_detail = result.data.response;
                    //console.log(convention_cife_detail[0]);
                    var montant = parseInt(vm.selectedItemConvention_daff_ufp.montant_estime) + parseInt(convention_cife_detail[0].montant_total);
                    miseajourconvention_daff_ufp(vm.selectedItemConvention_daff_ufp,'0',montant);
                });
             
              }, function(){//alert('rien');
            });

        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi
        function insert_in_base_convention_cisco_feffi(convention_cisco_feffi,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            //var validation = 1;
            var datas = $.param({
                    supprimer: suppression,
                    id:        convention_cisco_feffi.id,      
                    numero_convention: convention_cisco_feffi.numero_convention,
                    objet: convention_cisco_feffi.objet,
                    id_cisco: convention_cisco_feffi.cisco.id,
                    id_feffi:convention_cisco_feffi.feffi.id,
                    financement: convention_cisco_feffi.financement,
                    delai: convention_cisco_feffi.delai,
                    date_signature: convertionDate(new Date(convention_cisco_feffi.date_signature)),
                    id_convention_ufpdaaf: vm.selectedItemConvention_daff_ufp.id,
                    validation: validation               
                });
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            {   if (NouvelItemConvention_cisco_feffi== false)
                { 
                  vm.allconvention_cisco_feffi = vm.allconvention_cisco_feffi.filter(function(obj)
                  {
                      return obj.id !== vm.selectedItemConvention_cisco_feffi.id;
                  });
                }else
                {               
                  var item =
                  {
                      id:  convention_cisco_feffi.id,
                      objet: convention_cisco_feffi.objet,
                      cisco: convention_cisco_feffi.cisco,
                      feffi: convention_cisco_feffi.feffi,
                      delai: convention_cisco_feffi.delai,
                      validation:  validation,
                      financement: convention_cisco_feffi.financement,
                      date_signature: convention_cisco_feffi.date_signature,
                      numero_convention: convention_cisco_feffi.numero_convention,
                      id_convention_daff_ufp:  vm.selectedItemConvention_daff_ufp.id                     
                       
                  }
                    vm.allconvention_cisco_feffi.push(item);
                    NouvelItemConvention_cisco_feffi= false;
                }
                
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        } 

        //insertion ou mise a jours ou suppression item dans bdd convention_daff_ufp
        function miseajourconvention_daff_ufp(convention_daff_ufp,suppression, montant_estime)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_daff_ufp==false)
            {
                getId = vm.selectedItemConvention_daff_ufp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet:   convention_daff_ufp.objet,
                    montant_estime: montant_estime,
                    numero_convention: convention_daff_ufp.numero_convention,
                    date_signature: convertionDate(new Date(convention_daff_ufp.date_signature))               
                });
                //factory
            apiFactory.add("convention_daff_ufp/index",datas, config).success(function (data)
            {
               
                if (NouvelItemConvention_daff_ufp == false)
                {
                    // Update_signature or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemConvention_daff_ufp.objet = convention_daff_ufp.objet;
                        vm.selectedItemConvention_daff_ufp.montant_estime = montant_estime;
                        vm.selectedItemConvention_daff_ufp.date_signature = convention_daff_ufp.date_signature;
                        vm.selectedItemConvention_daff_ufp.numero_convention = convention_daff_ufp.numero_convention;                     
                    }
                    else 
                    {    
                      vm.allconvention_daff_ufp = vm.allconvention_daff_ufp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemConvention_daff_ufp.id;
                      });
                    }
                }
                else
                {
                 
                  convention_daff_ufp.objet = convention_daff_ufp.objet;
                  convention_daff_ufp.montant_estime = montant_estime;
                  convention_daff_ufp.date_signature = convention_daff_ufp.date_signature;
                  convention_daff_ufp.numero_convention = convention_daff_ufp.numero_convention;
                  convention_daff_ufp.id = String(data.response);              
                  
            }              
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }             

  /*****************Fin StepTwo convention****************/        

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
        {titre:"Feffi"},
        {titre:"Objet"},
        {titre:"Numero convention"},        
        {titre:"Financement"},
        {titre:"Delai"},
        {titre:"Date signature"}];

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventioninvalide').then(function(result)
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
