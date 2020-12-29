(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.addition_frais_fonctionnement')        
        .controller('Addition_frais_fonctionnementController', Addition_frais_fonctionnementController)
    /** @ngInject */
    function Addition_frais_fonctionnementController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepAddition=false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;
        vm.myFile = [];

/*******************************Debut initialisation suivi financement feffi******************************/ 
        vm.validation = 0;
        vm.roles = [];


        //initialisation decaissement fonctionnement feffi
        vm.ajoutAddition_frais_fonctionnement = ajoutAddition_frais_fonctionnement;
        var NouvelItemAddition_frais_fonctionnement=false;
        var currentItemAddition_frais_fonctionnement;
        vm.selectedItemAddition_frais_fonctionnement = {} ;
        vm.alladdition_frais_fonctionnement = [] ;  

/*******************************Fin initialisation suivi financement feffi******************************/

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          order: []          
        };

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

        vm.datenow = new Date();

       

        vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
           /* if (vm.session=='ADMIN')
            {*/
              if (item.id_region != '*')
              {
                  apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                  {
                      vm.ciscos = result.data.response;
                      console.log(vm.ciscos);
                  }, function error(result){ alert('something went wrong')});
              }
              else
              {               
                  vm.ciscos = [];                
              }
           // }
            
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
                console.log(vm.communes);
              }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.ecoles = result.data.response;
                console.log(vm.ecoles);
              }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.ecoles = [];
            }
          
        }
        vm.filtre_change_ecole = function(item)
        { 
            vm.filtre.id_convention_entete_entete = null;
            if (item.id_ecole != '*')
            {
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
                  {
                    vm.convention_cisco_feffi_entetes = result.data.response;
                    console.log(vm.convention_cisco_feffi_entetes );
                  }, function error(result){ alert('something went wrong')});
            }
        }
        apiFactory.getAll("region/index").then(function success(response)
        {
            vm.regions = response.data.response;
        });

        
        apiFactory.getAll("rubrique_addition_fonct_feffi/index").then(function success(response)
        {
            vm.allrubrique_addition_fonctionnement = response.data.response;
        });

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Code sous projet site"
        },
        {titre:"Accés site"
        },
        {titre:"Référence convention"
        },
        {titre:"Objet"
        },
        {titre:"Référence Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Utilisateur"
        }]; 
     

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;

            });
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepAddition=true
                         

        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
        });
        
  /**********************************fin decaissement fonctionnement feffi******************************/

        vm.step_menu_addition = function()
        { 
          vm.affiche_load =true;
          apiFactory.getAPIgeneraliserREST("addition_frais_fonctionnement/index",'menu','getaddition_invalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alladdition_frais_fonctionnement = result.data.response;
              console.log(vm.alladdition_frais_fonctionnement);
              vm.affiche_load =false; 
          });
        }
        //Masque de saisi ajout
        vm.ajouterAddition_frais_fonctionnement= function ()
        { 
          
          if (NouvelItemAddition_frais_fonctionnement == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              libelle: '',
              montant: '',
              observation: ''
            };
        
            vm.alladdition_frais_fonctionnement.unshift(items);
            vm.alladdition_frais_fonctionnement.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAddition_frais_fonctionnement = mem;
              }
            });

            NouvelItemAddition_frais_fonctionnement = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout addition_frais_fonctionnement','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAddition_frais_fonctionnement(addition_frais_fonctionnement,suppression)
        {
            if (NouvelItemAddition_frais_fonctionnement==false)
            {
                apiFactory.getAPIgeneraliserREST("addition_frais_fonctionnement/index",'menu',"getaddition_frais_fonctionnementById",'id_addition',addition_frais_fonctionnement.id).then(function(result)
                {
                  var addition_frais_fonctionnement_valide = result.data.response;
                  if (addition_frais_fonctionnement_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.alladdition_frais_fonctionnement = vm.alladdition_frais_fonctionnement.filter(function(obj)
                      {
                          return obj.id !== addition_frais_fonctionnement.id;
                      });

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceAddition_frais_fonctionnement (addition_frais_fonctionnement,suppression);  
                  }
                }); 
            } 
            else
            {
                insert_in_baseAddition_frais_fonctionnement(addition_frais_fonctionnement,suppression);
            }
        }

        //fonction de bouton d'annulation addition_frais_fonctionnement
        vm.annulerAddition_frais_fonctionnement = function(item)
        {
          if (NouvelItemAddition_frais_fonctionnement == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant   = currentItemAddition_frais_fonctionnement.montant ;
            item.libelle   = currentItemAddition_frais_fonctionnement.libelle ;
            item.observation   = currentItemAddition_frais_fonctionnement.observation ;
          }else
          {
            vm.alladdition_frais_fonctionnement = vm.alladdition_frais_fonctionnement.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAddition_frais_fonctionnement.id;
            });
          }

          vm.selectedItemAddition_frais_fonctionnement = {} ;
          NouvelItemAddition_frais_fonctionnement      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionAddition_frais_fonctionnement= function (item)
        {
            vm.selectedItemAddition_frais_fonctionnement = item;
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemAddition_frais_fonctionnement    = JSON.parse(JSON.stringify(vm.selectedItemAddition_frais_fonctionnement));

                
            }
            vm.validation_decais_fef=item.validation;
            
        };
        $scope.$watch('vm.selectedItemAddition_frais_fonctionnement', function()
        {
             if (!vm.alladdition_frais_fonctionnement) return;
             vm.alladdition_frais_fonctionnement.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAddition_frais_fonctionnement.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAddition_frais_fonctionnement = function(item)
        {
            NouvelItemAddition_frais_fonctionnement = false ;
            vm.selectedItemAddition_frais_fonctionnement = item;
            currentItemAddition_frais_fonctionnement = angular.copy(vm.selectedItemAddition_frais_fonctionnement);
            $scope.vm.alladdition_frais_fonctionnement.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.montant   = parseFloat(vm.selectedItemAddition_frais_fonctionnement.montant);
            item.libelle   = vm.selectedItemAddition_frais_fonctionnement.libelle ;
            item.observation   = vm.selectedItemAddition_frais_fonctionnement.observation ;
            item.id_rubrique_addition   = vm.selectedItemAddition_frais_fonctionnement.rubrique.id;
        };

        //fonction bouton suppression item addition_frais_fonctionnement
        vm.supprimerAddition_frais_fonctionnement = function()
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
                vm.ajoutAddition_frais_fonctionnement(vm.selectedItemAddition_frais_fonctionnement,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAddition_frais_fonctionnement (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alladdition_frais_fonctionnement.filter(function(obj)
                {
                   return obj.id == currentItemAddition_frais_fonctionnement.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant   != currentItemAddition_frais_fonctionnement.montant )
                    ||(mem[0].observation   != currentItemAddition_frais_fonctionnement.observation )
                    ||(mem[0].id_rubrique_addition   != currentItemAddition_frais_fonctionnement.id_rubrique_addition ))                   
                      { 
                         insert_in_baseAddition_frais_fonctionnement(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAddition_frais_fonctionnement(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd addition_frais_fonctionnement
        function insert_in_baseAddition_frais_fonctionnement(addition_frais_fonctionnement,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAddition_frais_fonctionnement==false)
            {
                getId = vm.selectedItemAddition_frais_fonctionnement.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant: addition_frais_fonctionnement.montant,
                    libelle: addition_frais_fonctionnement.libelle,
                    observation: addition_frais_fonctionnement.observation,
                    id_rubrique_addition: addition_frais_fonctionnement.id_rubrique_addition,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("addition_frais_fonctionnement/index",datas, config).success(function (data)
            {  
              var rubri = vm.allrubrique_addition_fonctionnement.filter(function(obj)
                {
                   return obj.id == addition_frais_fonctionnement.id_rubrique_addition;
                });

              if (NouvelItemAddition_frais_fonctionnement == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    { 
                        vm.selectedItemAddition_frais_fonctionnement.rubrique  = rubri[0];
                        vm.selectedItemAddition_frais_fonctionnement.$selected  = false;
                        vm.selectedItemAddition_frais_fonctionnement.$edit      = false;
                        vm.selectedItemAddition_frais_fonctionnement ={};
                        vm.showbuttonValidation_addition_feffi = false;
                    }
                    else 
                    {    
                      vm.alladdition_frais_fonctionnement = vm.alladdition_frais_fonctionnement.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAddition_frais_fonctionnement.id;
                      });
                      vm.showbuttonValidation_addition_feffi = false;
                    }
              }
              else
              {   
                  //addition_frais_fonctionnement.convention_entete = conv[0];
                  addition_frais_fonctionnement.rubrique  = rubri[0];
                  addition_frais_fonctionnement.id  =   String(data.response);              
                  NouvelItemAddition_frais_fonctionnement = false;
                  addition_frais_fonctionnement.validation = 0;
                                        
               }
              
              addition_frais_fonctionnement.$selected = false;
              addition_frais_fonctionnement.$edit = false;
              vm.selectedItemAddition_frais_fonctionnement = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }        

    /*********************************************Fin decaissement feffi************************************************/
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
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

        vm.formatMillier = function (nombre) 
      {   //var nbr = nombre.toFixed(0);
        var nbr=parseFloat(nombre);
        var n = nbr.toFixed(2);
        var spl= n.split('.');
        var apre_virgule = spl[1];
        var avan_virgule = spl[0];

          if (typeof avan_virgule != 'undefined' && parseInt(avan_virgule) >= 0) {
              avan_virgule += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(avan_virgule)) {
                  avan_virgule = avan_virgule.replace(reg, '$1' + sep + '$2');
              }
              return avan_virgule+","+apre_virgule;
          } else {
              return "0,00";
          }
      }
 
    }
})();
