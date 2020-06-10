
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi_validation')
        .controller('Convention_cisco_feffi_validationController', Convention_cisco_feffi_validationController);
    /** @ngInject */
    function Convention_cisco_feffi_validationController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        var NouvelItemTete = false;
        var currentItemTete;
        vm.allfeffi = [];
        vm.allsite = [];

        var NouvelItemDetail = false;
        var currentItemDetail;

        var NouvelItemBatiment_construction = false;
        var currentItemBatiment_construction;

        var NouvelItemcout_maitrise_construction = false;
        var currentItemcout_maitrise_construction;
        vm.selectedItemcout_maitrise_construction = {} ;
        vm.ajoutcout_maitrise_construction = ajoutcout_maitrise_construction ;

        var NouvelItemcout_sousprojet_construction = false;
        var currentItemcout_sousprojet_construction;
        vm.selectedItemcout_sousprojet_construction = {} ;
        vm.ajoutcout_sousprojet_construction = ajoutcout_sousprojet_construction ;

        vm.date_now         = new Date();
        vm.allcisco         = [] ;
        vm.ajoutTete        = ajoutTete ;
        vm.selectedItemTete = {} ;
        vm.selectedItemTete.$selected=false;
        vm.allconvention_cife_tete  = [] ;
        vm.allcompte_feffi = [];

        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.stepFor           = false;

        vm.ajoutDetail = ajoutDetail ;
        vm.selectedItemDetail = {} ;

        vm.allconvention_cife_detail  = [] ;
        vm.showbuttonNouvDetail=true;


        //vm.allattachement_batiment  = [] ;
        vm.alltype_batiment  = [] ;

        vm.ajoutBatiment_construction = ajoutBatiment_construction ;
        vm.selectedItemBatiment_construction = {} ;
        vm.selectedItemBatiment_construction.$selected=false;
        vm.allbatiment_construction  = [] ;

        //vm.allattachement_latrine  = [] ;
        vm.alltype_latrine  = [] ;

        var NouvelItemLatrine_construction = false;
        var currentItemLatrine_construction;

        vm.ajoutLatrine_construction = ajoutLatrine_construction ;
        vm.selectedItemLatrine_construction = {} ;
        vm.selectedItemLatrine_construction.$selected=false;
        vm.alllatrine_construction  = [] ;
        vm.subvention_initial = [];

        //vm.allattachement_mobilier  = [] ;
        vm.alltype_mobilier  = [] ;

        var NouvelItemMobilier_construction = false;
        var currentItemMobilier_construction;

        vm.ajoutMobilier_construction = ajoutMobilier_construction ;
        vm.selectedItemMobilier_construction = {} ;
        vm.selectedItemMobilier_construction.$selected=false;
        vm.allmobilier_construction  = [] ;
        vm.showbuttonNouvMobilier=true;
        vm.showbuttonNouvBatiment=true;
        vm.showbuttonNouvLatrine=true;
        vm.showbuttonNouvMobilier=true;
        vm.showbuttonNouvMaitrise=true;
        vm.showbuttonNouvSousprojet=true;

        vm.afficherboutonValider = false;
        vm.permissionboutonValider = false;
        //vm.usercisco = [];
      /*****fin initialisation*****/
        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: true          
        };

        //style
        vm.dtOptionsperso = {
          dom: '<"top">rt<"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        
        var id_user = $cookieStore.get('id');
        var annee = vm.date_now.getFullYear();
        
        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        });


/********************************Debut get convention entete by cisco***********************************/
apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
            vm.user = result.data.response;
            var usercisco = result.data.response.cisco;
            
            vm.allcisco.push(usercisco);

            if(result.data.response.roles.indexOf("BCAF")!= -1)
            {
                if (usercisco.id!=undefined)
                {
                    apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionBycisconow','id_cisco',usercisco.id,'annee',annee).then(function(result)
                    {
                        vm.allconvention_cife_tete = result.data.response; 
                        console.log(vm.allconvention_cife_tete);
                    });
                    vm.session='BCAF';
                  //vm.session='ADMIN';

            vm.id_cisco = result.data.response.cisco.id;
                }
            }
            else
            {
                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionnow','annee',annee).then(function(result)
                {
                    vm.allconvention_cife_tete = result.data.response; 
                    console.log(vm.allconvention_cife_tete);
                });
                vm.session='ADMIN';
                 //vm.session='OBCAF';
            }
            
        });

        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=false;
          vm.showfiltre=true;
        }

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);

            if(vm.session=='OBCAF')
            {
                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionByciscofiltre','id_cisco',vm.id_cisco,
              'date_debut',date_debut,'date_fin',date_fin).then(function(result)
              {
                  vm.allconvention_cife_tete = result.data.response; 
                  console.log(vm.allconvention_cife_tete);
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionfiltre',
              'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
                filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',
                filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
              {
                  vm.allconvention_cife_tete = result.data.response; 
                  console.log(vm.allconvention_cife_tete);
              });
            }
            
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
            vm.showbuttonfiltre=true;
            vm.showfiltre=false;
        }

         vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                });
            }
            else
            {
                vm.ciscos = [];
            }
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
              });
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index","getzap_communeBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.filtre_change_zap = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.ecoles = result.data.response;
              });
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
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventioninvalideByecole","id_ecole",item.id_ecole).then(function(result)
                  {
                    vm.convention_cisco_feffi_entetes = result.data.response;
                    console.log(vm.convention_cisco_feffi_entetes );
                  }, function error(result){ alert('something went wrong')});
            }
        }

/********************************Fin get convention entete by cisco***********************************/

/********************************Debut affichage nombre **********************************************/

        vm.formatMillier = function (nombre) 
        {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
        }

/********************************Fin affichage nombre **********************************************/


/**********************************Debut convention entete******************************************/

        //col table
        vm.convention_cife_tete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Site"
        },
        {titre:"Type convention"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        },
        {titre:"Utilisateur"
        },
        {titre:"Action"
        }];
        
        //Masque de saisi ajout
        vm.ajouterTete = function ()
        { 

          var maxnum =1;
          if (NouvelItemTete == false)
          { 
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','conventionmaxBydate','date_today',convertionDate(new Date())).then(function(result)
              {
                 /***************************** Debut ref_convention auto********************/

                    var maxconventiontoday = result.data.response;
                    if (maxconventiontoday.length!=0)
                    {
                      maxnum =parseInt(maxconventiontoday[0].ref_convention.split('/')[2])+1;                    
                    }
                    var ref_auto = 'CO/'+vm.formatDate(new Date())+'/'+maxnum;

                  /***************************** Fin ref_convention auto********************/
                  var items = {
                        $edit: true,
                        $selected: true,
                        id: '0',
                        id_cisco:'',
                        id_feffi:'',
                        id_site:'',
                        type_convention:'',
                        ref_convention: ref_auto,
                        objet: 'MOD pour la construction de 02 salles de classe équipées',
                        ref_financement: 'Crédit IDA N° 62170',
                        montant_total:0,
                        avancement:0,
                        user_nom:vm.user.nom
                      };       
                      vm.allconvention_cife_tete.push(items);
                      vm.allconvention_cife_tete.forEach(function(conv)
                      {
                        if(conv.$selected==true)
                        {
                          vm.selectedItemTete = conv;
                        }
                      });

                      NouvelItemTete = true ;
              });
            
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };
        

        //fonction ajout dans bdd
        function ajoutTete(convention_cife_tete,suppression)
        {
            if (NouvelItemTete==false)
            {
                test_existanceTete (convention_cife_tete,suppression); 
            } 
            else
            {
                insert_in_baseTete(convention_cife_tete,suppression);
            }
        }

        //fonction de bouton d'annulation convention_cife_tete
        vm.annulerTete = function(item)
        {
          if (NouvelItemTete == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_cisco    = currentItemTete.id_cisco ;
              item.id_feffi    = currentItemTete.id_feffi ;
              item.id_site    = currentItemTete.id_site ;
              item.ref_convention  = currentItemTete.ref_convention ;
              item.objet       = currentItemTete.objet ;              
              item.ref_financement = currentItemTete.ref_financement ;
              item.montant_total = currentItemTete.montant_total; 
              item.avancement = currentItemTete.avancement; 
              item.user_nom = currentItemTete.user.nom;
              
          }else
          {
            vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
            {
                return obj.id !== vm.selectedItemTete.id;
            });
          }

          vm.selectedItemTete = {} ;
          NouvelItemTete      = false;
          
        };

        //fonction selection item entete convention cisco/feffi
        vm.selectionTete = function (item)
        {
            vm.selectedItemTete = item;            
            console.log(item.feffi.id);
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvDetail=true;
            vm.showbuttonNouvBatiment=true;
            //recuperation donnée convention
           if (item.id!=0)
            {
              if (item.$edit==false || item.$edit==undefined)
              {
                  currentItemTete     = JSON.parse(JSON.stringify(vm.selectedItemTete));
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
                  {
                      vm.allconvention_cife_detail = result.data.response;

                      if (vm.allconvention_cife_detail.length!=0)
                      {
                        vm.showbuttonNouvDetail=false;
                      } 
                      console.log(vm.selectedItemTete);
                      console.log(vm.allconvention_cife_detail);
                  });
                  apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
                  {
                    vm.allcompte_feffi = result.data.response;
                    console.log(vm.allcompte_feffi);
                   
                  });


                  apiFactory.getAPIgeneraliserREST("cout_maitrise_construction/index",'id_convention_entete',item.id).then(function(result)
                  {
                    vm.allcout_maitrise_construction = result.data.response;
                    if (vm.allcout_maitrise_construction.length >0)
                      {                    
                        vm.showbuttonNouvMaitrise=false;
                      }
                   
                  });
                  apiFactory.getAPIgeneraliserREST("cout_sousprojet_construction/index",'id_convention_entete',item.id).then(function(result)
                  {
                    vm.allcout_sousprojet_construction = result.data.response;
                    if (vm.allcout_sousprojet_construction.length >0)
                      {                    
                        vm.showbuttonNouvSousprojet=false;
                      }
                   
                  });
               
                  apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
                  {
                      vm.allbatiment_construction = result.data.response;

                      if (vm.allbatiment_construction.length >0)
                      {                    
                        vm.showbuttonNouvBatiment=false;
                      } 
                      console.log(vm.allbatiment_construction);
                  });

                  apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
                  {
                      vm.alllatrine_construction = result.data.response;

                      if (vm.alllatrine_construction.length >0)
                      {                    
                        vm.showbuttonNouvLatrine=false;
                      } 
                      console.log(vm.alllatrine_construction);
                  });


                  apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
                  {
                      vm.allmobilier_construction = result.data.response;

                      if (vm.allmobilier_construction.length >0)
                      {                    
                        vm.showbuttonNouvMobilier=false;
                      } 
                      console.log(vm.allmobilier_construction);
                  });

                  apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getbatimentByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
                  {
                    vm.alltype_batiment = result.data.response;
                    console.log(vm.alltype_batiment);
                  });

                  apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
                  {
                    vm.alltype_latrine = result.data.response;
                    console.log(vm.alltype_latrine);
                  });

                  apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
                  {
                    vm.alltype_mobilier = result.data.response;
                    console.log(vm.alltype_mobilier);
                  });

                  apiFactory.getAPIgeneraliserREST("type_cout_maitrise/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
                  {
                    vm.alltype_cout_maitrise = result.data.response;
                    console.log(vm.alltype_cout_maitrise);
                  });
                  apiFactory.getAPIgeneraliserREST("type_cout_sousprojet/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
                  {
                    vm.alltype_cout_sousprojet = result.data.response;
                    console.log(vm.alltype_cout_sousprojet);
                  });

                  vm.validation_item = item.validation;  
                  vm.afficherboutonValider = true;
                  vm.stepOne = true;
                  vm.stepTwo = false;
                  vm.stepThree = false;
              }
            };           

        };
        $scope.$watch('vm.selectedItemTete', function()
        {
             if (!vm.allconvention_cife_tete) return;
             vm.allconvention_cife_tete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTete.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierTete = function(item)
        {
            NouvelItemTete = false ;
            vm.selectedItemTete = item;
            currentItemTete = angular.copy(vm.selectedItemTete);
            $scope.vm.allconvention_cife_tete.forEach(function(cis) {
              cis.$edit = false;
            });            

            item.$edit = true;
            item.$selected = true;

            item.id_cisco = vm.selectedItemTete.cisco.id ;
            item.id_feffi = vm.selectedItemTete.feffi.id ;
            item.id_site = vm.selectedItemTete.site.id ;

            item.ref_convention  = vm.selectedItemTete.ref_convention ;
            item.objet           = vm.selectedItemTete.objet ;
            item.ref_financement = vm.selectedItemTete.ref_financement ;
            item.montant_total = parseInt(vm.selectedItemTete.montant_total);
            item.avancement = parseInt(vm.selectedItemTete.avancement);
            item.user_nom           = vm.selectedItemTete.user.nom ;

            vm.afficherboutonValider = false; 
            //recuperation donnée feffi
          apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',item.id_cisco).then(function(result)
          {
            vm.allfeffi= result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("site/index",'menu','getsitecreeByfeffi','id_feffi',item.id_feffi).then(function(result)
          {
            vm.allsite= result.data.response;
            vm.allsite.push(vm.selectedItemTete.site);
            console.log(vm.allsite);
          });

        };

        //fonction bouton suppression item entente convention cisco feffi
        vm.supprimerTete = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutTete(vm.selectedItemTete,1);
              }, function() {
                //alert('rien');
              });

              vm.stepOne = false;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceTete (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allconvention_cife_tete.filter(function(obj)
                {
                   return obj.id == currentItemTete.id;
                });
                if(convT[0])
                {
                   if((convT[0].delai!=currentItemTete.delai)
                    || (convT[0].id_cisco!=currentItemTete.id_cisco)
                    || (convT[0].id_feffi!=currentItemTete.id_feffi)
                    || (convT[0].id_site!=currentItemTete.id_site)
                    || (convT[0].objet!=currentItemTete.objet)
                    || (convT[0].type_convention!=currentItemTete.type_convention)                    
                    || (convT[0].ref_financement!=currentItemTete.ref_financement)
                    || (convT[0].ref_convention!=currentItemTete.ref_convention))                   
                                       
                      { console.log(convT[0].id_feffi);
                        console.log(currentItemTete.id_feffi);
                        if (convT[0].id_feffi!=currentItemTete.feffi.id)
                        {   
                            var confirm = $mdDialog.confirm()
                                        .title('Etes-vous sûr de cet enregistrement?')
                                        .textContent('En changeant FEFFI vous allez être supprimer tous données detail,batiment,latrine...')
                                        .ariaLabel('Lucky day')
                                        .clickOutsideToClose(true)
                                        .parent(angular.element(document.body))
                                        .ok('ok')
                                        .cancel('annuler');

                                  $mdDialog.show(confirm).then(function()
                                  {
                                    insert_in_baseTete(item,suppression);
                                    supressiondetail_construction();
                                  }, function() {
                                    //alert('rien');
                                  });
                          
                        }else
                        {
                          insert_in_baseTete(item,suppression);
                        }
                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTete(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseTete(convention_cife_tete,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            var user = id_user;
            if (NouvelItemTete ==false)
            {
                getId = vm.selectedItemTete.id;
                user = vm.selectedItemTete.user.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_cisco: convention_cife_tete.id_cisco,
                    id_feffi: convention_cife_tete.id_feffi,
                    id_site: convention_cife_tete.id_site,
                    type_convention:    convention_cife_tete.type_convention,
                    objet:    convention_cife_tete.objet,
                    ref_financement:  convention_cife_tete.ref_financement,
                    ref_convention:   convention_cife_tete.ref_convention,
                    montant_total:    convention_cife_tete.montant_total,
                    avancement:    convention_cife_tete.avancement,
                    id_user:    user,
                    validation: 0               
                });
                //console.log(convention.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            {
                
                var cis = vm.allcisco.filter(function(obj)
                {
                    return obj.id == convention_cife_tete.id_cisco;
                });

                var fef = vm.allfeffi.filter(function(obj)
                {
                    return obj.id == convention_cife_tete.id_feffi;
                });
                var sit = vm.allsite.filter(function(obj)
                {
                    return obj.id == convention_cife_tete.id_site;
                });

                if (NouvelItemTete == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTete.cisco   = cis[0];
                        vm.selectedItemTete.feffi = fef[0];
                        vm.selectedItemTete.site = sit[0];
                        vm.selectedItemTete.$selected  = false;
                        vm.selectedItemTete.$edit      = false;
                        vm.selectedItemTete ={};
                        
                        if (convention_cife_tete.id_site!=currentItemTete.site.id)
                        {currentItemTete.site.ecole = {id: currentItemTete.site.id_ecole}

                          console.log(fef[0].ecole);
                            maj_site_in_base(currentItemTete.site,0,0,fef[0].ecole.id); //site talou avadika validation 0
                                maj_site_in_base(sit[0],0,1,fef[0].ecole.id); //site vao2 validation 1
                              
                          
                        }
                    }
                    else 
                    {    
                      vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTete.id;
                      });
                      
                      maj_site_in_base(vm.selectedItemTete.site,0,0,vm.selectedItemTete.ecole.id);
                    }
                }
                else
                {
                  
                  convention_cife_tete.cisco = cis[0];
                  convention_cife_tete.user = vm.user;
                  convention_cife_tete.feffi = fef[0];
                  convention_cife_tete.ecole = fef[0].ecole;
                  convention_cife_tete.site = sit[0];
                  convention_cife_tete.id  =   String(data.response);
                  NouvelItemTete = false;
                  console.log(convention_cife_tete.ecole);
                  maj_site_in_base(sit[0],0,1,fef[0].ecole.id);
                  if (convention_cife_tete.type_convention == 1)
                  {
                    insert_initial_Batiment_construction(vm.subvention_initial[0],0,String(data.response));
                    insert_initial_Latrine_construction(vm.subvention_initial[0],0,String(data.response));
                    insert_initial_Mobilier_construction(vm.subvention_initial[0],0,String(data.response));
                    insert_initial_Cout_maitrise_construction(vm.subvention_initial[0],0,String(data.response));
                    insert_initial_Cout_sousprojet_construction(vm.subvention_initial[0],0,String(data.response));
                    convention_cife_tete.montant_total =parseInt(vm.subvention_initial[0].type_batiment.cout_batiment)+
                    parseInt(vm.subvention_initial[0].type_latrine.cout_latrine)+
                    parseInt(vm.subvention_initial[0].type_mobilier.cout_mobilier)+
                    parseInt(vm.subvention_initial[0].type_cout_maitrise.cout_maitrise)+
                    parseInt(vm.subvention_initial[0].type_cout_sousprojet.cout_sousprojet);
                  }
                  
            }
              convention_cife_tete.$selected = false;
              convention_cife_tete.$edit = false;
              vm.selectedItemTete = {};
              vm.afficherboutonValider = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.change_type_convention = function(item)
        {
          if (item.type_convention==1)
          { 
            var fef = vm.allfeffi.filter(function(obj)
            {
              return obj.id == item.id_feffi;
            });
console.log(fef[0]);
            apiFactory.getAPIgeneraliserREST("subvention_initial/index",'menu','getsubventionByzone','id_zone_subvention',fef[0].ecole.id_zone_subvention,'id_acces_zone',fef[0].ecole.id_acces_zone).then(function(result)
            {
                    vm.subvention_initial = result.data.response;
                    if(vm.subvention_initial.length==0)
                    {
                      vm.showAlert('Donnée initial vide','Vous devez remplire manuellement');
                      item.type_convention = 0;
                    }
                    console.log(vm.subvention_initial);
            });
          }
          
        }

        vm.change_feffi = function(item)
        { console.log(item);
          apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.id_feffi).then(function(result)
          {
              vm.allcompte_feffi = result.data.response;
              console.log(vm.allcompte_feffi);

          });
          var fef = vm.allfeffi.filter(function(obj)
          {
            return obj.id == item.id_feffi;
          });

          apiFactory.getOne("ecole/index",fef[0].ecole.id).then(function(result)
          {
            var tem={
                      libelle_zone: result.data.response.zone_subvention.libelle,
                      libelle_acces: result.data.response.acces_zone.libelle,
                      id_zone: result.data.response.zone_subvention.id,
                      id_acces: result.data.response.acces_zone.id,   
                    }
             item.ecole=tem;
          });
          item.id_site = null;
          if(NouvelItemTete == false)
          { 
            apiFactory.getAPIgeneraliserREST("site/index",'menu','getsitecreeByfeffi','id_feffi',item.id_feffi).then(function(result)
              {
                vm.allsite= result.data.response;
                vm.allsite.push(item.site);
                console.log(vm.allsite);
              });

            if (currentItemTete.feffi.id!=item.id_feffi)
            {
              vm.showAlert('Avertissement','Les detailles ainsi que travaux de construction seront supprimer si vous enregistre cette operation');
            }  
          }
          else 
            {
              apiFactory.getAPIgeneraliserREST("site/index",'menu','getsitecreeByfeffi','id_feffi',item.id_feffi).then(function(result)
              {
                vm.allsite= result.data.response;
                console.log(vm.allsite);
              });
            }
        }

        vm.change_cisco = function(item)
        {
          item.id_feffi = null;
//console.lod(item)
          //recuperation donnée feffi
          apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',item.id_cisco).then(function(result)
          {
            vm.allfeffi= result.data.response;
            console.log(vm.allfeffi);
          });
        }

       function supressiondetail_construction()
        { 
          //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    id_convention_entete: vm.selectedItemTete.id,
                    menu: 'supressionBytete'             
                });
            apiFactory.add("convention_cisco_feffi_detail/index",datas,config).then(function(result)
            { 
              vm.allbatiment_construction=[];
            });
        }

        vm.validerConvention = function()
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemTete.id,
                    id_cisco: vm.selectedItemTete.cisco.id,
                    id_feffi: vm.selectedItemTete.feffi.id,
                    id_site: vm.selectedItemTete.site.id,
                    type_convention: vm.selectedItemTete.type_convention,
                    objet:    vm.selectedItemTete.objet,
                    ref_financement:  vm.selectedItemTete.ref_financement,
                    ref_convention:   vm.selectedItemTete.ref_convention,
                    montant_total:    vm.selectedItemTete.montant_total,
                    avancement:    vm.selectedItemTete.avancement,
                    id_user: vm.selectedItemTete.user.id,
                    validation: 1               
                });

            console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            { 
               /* vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemTete.id;
                });*/
                vm.selectedItemTete.validation=1;
                vm.validation_item =1;
                maj_site_in_base(vm.selectedItemTete.site,0,2,vm.selectedItemTete.ecole.id);
                   
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
        }

        vm.affichage_type_convention = function(type_convention)
        { 
          var affichage = 'Initial';
          if(type_convention == 0)
          {
            affichage = 'Autre';
          }
          return affichage;
        }

/**********************************fin convention entete***********************************/


/****************************Debut ise à jour site******************************/
      function maj_site_in_base(site,suppression,statu,id_ecole)
        {
            //add
            console.log(site);
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        site.id,      
                    code_sous_projet:      site.code_sous_projet,
                    denomination_epp:      site.denomination_epp,      
                    observation:    site.observation,
                    agence_acc:   site.agence_acc,
                    statu_convention:    statu,
                    objet_sous_projet: site.objet_sous_projet,
                    id_ecole: id_ecole,                
                });
                console.log(datas);
                //factory
            apiFactory.add("site/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/****************************Fin mise à jour site******************************/


/****************************Debut insertion batiment_construction initial******************************/
        function insert_initial_Batiment_construction(batiment_construction,suppression,id_convention_entete)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        0,
                    id_type_batiment: batiment_construction.type_batiment.id,
                    cout_unitaire: batiment_construction.type_batiment.cout_batiment,
                    id_convention_entete: id_convention_entete

                });
                console.log(batiment_construction);
                console.log(datas);
                //factory
            apiFactory.add("batiment_construction/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée initial batiment');});


        }
/****************************Fin insertion batiment_construction initial******************************/


/****************************Debut insertion latrine_construction initial******************************/
        function insert_initial_Latrine_construction(latrine_construction,suppression,id_convention_entete)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        0,
                    id_type_latrine: latrine_construction.type_latrine.id,
                    cout_unitaire: latrine_construction.type_latrine.cout_latrine,
                    id_convention_entete: id_convention_entete

                });
                console.log(latrine_construction);
                console.log(datas);
                //factory
            apiFactory.add("latrine_construction/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée initial latrine');});


        }
/****************************Fin insertion latrine_construction initial******************************/


/****************************Debut insertion mobilier_construction initial******************************/
        function insert_initial_Mobilier_construction(mobilier_construction,suppression,id_convention_entete)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        0,
                    id_type_mobilier: mobilier_construction.type_mobilier.id,
                    cout_unitaire: mobilier_construction.type_mobilier.cout_mobilier,
                    id_convention_entete: id_convention_entete

                });
                console.log(mobilier_construction);
                console.log(datas);
                //factory
            apiFactory.add("mobilier_construction/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée initial mobilier');});


        }
/****************************Fin insertion mobilier_construction initial******************************/

/****************************Debut insertion cout_maitrise_construction initial******************************/
        function insert_initial_Cout_maitrise_construction(cout_maitrise_construction,suppression,id_convention_entete)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        0,
                    id_type_cout_maitrise: cout_maitrise_construction.type_cout_maitrise.id,
                    cout: cout_maitrise_construction.type_cout_maitrise.cout_maitrise,
                    id_convention_entete: id_convention_entete

                });
                console.log(cout_maitrise_construction);
                console.log(datas);
                //factory
            apiFactory.add("cout_maitrise_construction/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée initial cout maitrise d\'oeuvre');});


        }
/****************************Fin insertion cout_maitrise_construction initial******************************/

/****************************Debut insertion cout_sousprojet_construction initial******************************/
        function insert_initial_Cout_sousprojet_construction(cout_sousprojet_construction,suppression,id_convention_entete)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        0,
                    id_type_cout_sousprojet: cout_sousprojet_construction.type_cout_sousprojet.id,
                    cout: cout_sousprojet_construction.type_cout_sousprojet.cout_sousprojet,
                    id_convention_entete: id_convention_entete

                });
                console.log(cout_sousprojet_construction);
                console.log(datas);
                //factory
            apiFactory.add("cout_sousprojet_construction/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée initial cout sous projet');});


        }
/****************************Fin insertion cout_sousprojet_construction initial******************************/


/***************************************debut cout maitrise***********************************/

      vm.cout_maitrise_construction_column = 
      [
        {
          titre:"Maitrise d'oeuvre"
        },
        {
          titre:"Coût"
        },
        {
          titre:"Action"
        }
      ];

      vm.ajoutercout_maitrise_construction = function()
        {
          console.log(NouvelItemcout_maitrise_construction);
          if (NouvelItemcout_maitrise_construction == false) 
          {
            NouvelItemcout_maitrise_construction = true ;

            var items = 
            {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_cout_maitrise:'',
              cout:''
            };   

            vm.allcout_maitrise_construction.push(items);
            vm.selectedItemcout_maitrise_construction = items ;
          }
          else
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
            
        }


        vm.modifiercout_maitrise_construction = function(item)
        {

          NouvelItemcout_maitrise_construction == false;
          vm.selectedItemcout_maitrise_construction = item ;
          currentItemcout_maitrise_construction = angular.copy(item) ;
          $scope.vm.allcout_maitrise_construction.forEach(function(cis) {
          cis.$edit = false;
            });

          item.$edit = true;
          item.$selected = true;

          item.id_type_cout_maitrise = vm.selectedItemcout_maitrise_construction.type_cout_maitrise.id ;            
          item.description = vm.selectedItemcout_maitrise_construction.description ;
          item.cout = (Number)(item.cout) ;

         
        }


        vm.ajoutcout_maitrise = function(cout_maitrise,suppression)
        {
          console.log(cout_maitrise);

          insert_in_base_cout_maitrise(cout_maitrise,suppression) ;
        }
        //fonction ajout dans bdd
        function ajoutcout_maitrise_construction(cout_maitrise_construction,suppression)
        {
            if (NouvelItemcout_maitrise_construction==false)
            {
                test_existancecout_maitrise_construction (cout_maitrise_construction,suppression); 
            } 
            else
            {
                insert_in_basecout_maitrise_construction(cout_maitrise_construction,suppression);
            }
        }

        vm.supprimercout_maitrise_construction = function(item)
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() 
              {
                insert_in_basecout_maitrise_construction(vm.selectedItemcout_maitrise_construction,1);
              }, 
              function() 
              {
                //alert('rien');
              });
        }

        function test_existancecout_maitrise_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var cout_mai = vm.allcout_maitrise_construction.filter(function(obj)
                {
                   return obj.id == currentItemcout_maitrise_construction.id;
                });
                if(cout_mai[0])
                {
                   if((cout_mai[0].id_type_cout_maitrise!=currentItemcout_maitrise_construction.id_type_cout_maitrise)
                    || (cout_mai[0].cout!=currentItemcout_maitrise_construction.cout)
                    )                    
                      { 
                        insert_in_basecout_maitrise_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basecout_maitrise_construction(item,suppression);
        }


        function insert_in_basecout_maitrise_construction(cout_maitrise_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemcout_maitrise_construction == false)
            {
                getId = vm.selectedItemcout_maitrise_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id: getId,
                    id_type_cout_maitrise: cout_maitrise_construction.id_type_cout_maitrise,
                    cout: cout_maitrise_construction.cout,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("cout_maitrise_construction/index",datas, config).success(function (data)
            {
                var type_mait = vm.alltype_cout_maitrise.filter(function(obj)
                {
                    return obj.id == cout_maitrise_construction.id_type_cout_maitrise;
                });           

              if (NouvelItemcout_maitrise_construction == false)
              {
                  // Update or delete: id exclu                 
                  if(suppression == 0)
                  {
                      //update tsy miasa eto
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total)- currentItemcout_maitrise_construction.cout + cout_maitrise_construction.cout ;

                        vm.selectedItemTete.montant_total= cout_tot;
                        vm.selectedItemcout_maitrise_construction.type_cout_maitrise= type_mait[0];

                        vm.selectedItemcout_maitrise_construction.$selected  = false;
                        vm.selectedItemcout_maitrise_construction.$edit      = false;
                        vm.selectedItemcout_maitrise_construction ={};
                  }
                  else 
                  {    
                    vm.allcout_maitrise_construction = vm.allcout_maitrise_construction.filter(function(obj)
                    {
                       return obj.id !== cout_maitrise_construction.id;
                    });
                    vm.selectedItemTete.montant_total= parseInt(vm.selectedItemTete.montant_total)-vm.selectedItemcout_maitrise_construction.cout;
                    vm.showbuttonNouvMaitrise = true;
                  }
              }
              else
              {
                
                cout_maitrise_construction.id = String(data.response);
                NouvelItemcout_maitrise_construction = false ;
                vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+cout_maitrise_construction.cout;
                cout_maitrise_construction.type_cout_maitrise= type_mait[0];
                vm.showbuttonNouvMaitrise = false;
              }              
            cout_maitrise_construction.$selected = false;
              cout_maitrise_construction.$edit = false;
              vm.selectedItemcout_maitrise_construction = {};
            })
            .error
            (
              function (data)
              {
                vm.showAlert("Error","Erreur lors de l'insertion de donnée");
              }
            );


        }

        vm.annulercout_maitrise_construction = function(item)
        {
          if (NouvelItemcout_maitrise_construction == false)
          {
            item.$edit = false;
            item.$selected = false;
            
            item.id_type_cout_maitrise = currentItemcout_maitrise_construction.type_cout_maitrise.id ;
            item.cout = currentItemcout_maitrise_construction.cout ;
          }
          else
          {
            vm.allcout_maitrise_construction = vm.allcout_maitrise_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemcout_maitrise_construction.id;
            });
          }
          NouvelItemcout_maitrise_construction      = false;
          vm.selectedItemcout_maitrise_construction = {} ;

        }

        vm.selectcout_maitrise_construction = function(item)
        {
          vm.selectedItemcout_maitrise_construction = item ;
          console.log(vm.selectedItemcout_maitrise_construction);
          if(item.$selected==false || item.$selected==undefined)
          {
              currentItemcout_maitrise_construction     = JSON.parse(JSON.stringify(vm.selectedItemcout_maitrise_construction));
          }
        }

        $scope.$watch('vm.selectedItemcout_maitrise_construction', function()
        {
             if (!vm.allcout_maitrise_construction) return;
             vm.allcout_maitrise_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemcout_maitrise_construction.$selected = true;
        });

        vm.changetype_cout_maitrise = function(item)
        { 
            var typ_mai = vm.alltype_cout_maitrise.filter(function(obj)
            {
                return obj.id == item.id_type_cout_maitrise;
            });
            item.cout = parseInt(typ_mai[0].cout_maitrise);
            
        };

/*********************************fin cout maitrise*************************************/

/********************************debut cout sousprojet*******************************/
      vm.cout_sousprojet_construction_column = 
      [
        {
          titre:"Sous projet"
        },
        {
          titre:"Coût"
        },
        {
          titre:"Action"
        }
      ];

      vm.ajoutercout_sousprojet_construction = function()
        {
          console.log(NouvelItemcout_sousprojet_construction);
          if (NouvelItemcout_sousprojet_construction == false) 
          {
            NouvelItemcout_sousprojet_construction = true ;

            var items = 
            {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_cout_sousprojet:'',
              cout:''
            };   

            vm.allcout_sousprojet_construction.push(items);
            vm.selectedItemcout_sousprojet_construction = items ;
          }
          else
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
            
        }


        vm.modifiercout_sousprojet_construction = function(item)
        {

          NouvelItemcout_sousprojet_construction == false;
          vm.selectedItemcout_sousprojet_construction = item ;
          currentItemcout_sousprojet_construction = angular.copy(item) ;
          $scope.vm.allcout_sousprojet_construction.forEach(function(cis) {
          cis.$edit = false;
            });

          item.$edit = true;
          item.$selected = true;

          item.id_type_cout_sousprojet = vm.selectedItemcout_sousprojet_construction.type_cout_sousprojet.id ;            
          item.description = vm.selectedItemcout_sousprojet_construction.description ;
          item.cout = (Number)(item.cout) ;

         
        }


        vm.ajoutcout_sousprojet = function(cout_sousprojet,suppression)
        {
          console.log(cout_sousprojet);

          insert_in_base_cout_sousprojet(cout_sousprojet,suppression) ;
        }
        //fonction ajout dans bdd
        function ajoutcout_sousprojet_construction(cout_sousprojet_construction,suppression)
        {
            if (NouvelItemcout_sousprojet_construction==false)
            {
                test_existancecout_sousprojet_construction (cout_sousprojet_construction,suppression); 
            } 
            else
            {
                insert_in_basecout_sousprojet_construction(cout_sousprojet_construction,suppression);
            }
        }

        vm.supprimercout_sousprojet_construction = function(item)
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() 
              {
                insert_in_basecout_sousprojet_construction(vm.selectedItemcout_sousprojet_construction,1);
              }, 
              function() 
              {
                //alert('rien');
              });
        }

        function test_existancecout_sousprojet_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var cout_mai = vm.allcout_sousprojet_construction.filter(function(obj)
                {
                   return obj.id == currentItemcout_sousprojet_construction.id;
                });
                if(cout_mai[0])
                {
                   if((cout_mai[0].id_type_cout_sousprojet!=currentItemcout_sousprojet_construction.id_type_cout_sousprojet)
                    || (cout_mai[0].cout!=currentItemcout_sousprojet_construction.cout)
                    )                    
                      { 
                        insert_in_basecout_sousprojet_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basecout_sousprojet_construction(item,suppression);
        }


        function insert_in_basecout_sousprojet_construction(cout_sousprojet_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemcout_sousprojet_construction == false)
            {
                getId = vm.selectedItemcout_sousprojet_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id: getId,
                    id_type_cout_sousprojet: cout_sousprojet_construction.id_type_cout_sousprojet,
                    cout: cout_sousprojet_construction.cout,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("cout_sousprojet_construction/index",datas, config).success(function (data)
            {
                var type_mait = vm.alltype_cout_sousprojet.filter(function(obj)
                {
                    return obj.id == cout_sousprojet_construction.id_type_cout_sousprojet;
                });           

              if (NouvelItemcout_sousprojet_construction == false)
              {
                  // Update or delete: id exclu                 
                  if(suppression == 0)
                  {
                      //update tsy miasa eto
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total)- currentItemcout_sousprojet_construction.cout + cout_sousprojet_construction.cout ;

                        vm.selectedItemTete.montant_total= cout_tot;
                        vm.selectedItemcout_sousprojet_construction.type_cout_sousprojet= type_mait[0];

                        vm.selectedItemcout_sousprojet_construction.$selected  = false;
                        vm.selectedItemcout_sousprojet_construction.$edit      = false;
                        vm.selectedItemcout_sousprojet_construction ={};
                  }
                  else 
                  {    
                    vm.allcout_sousprojet_construction = vm.allcout_sousprojet_construction.filter(function(obj)
                    {
                       return obj.id !== cout_sousprojet_construction.id;
                    });
                    vm.selectedItemTete.montant_total= parseInt(vm.selectedItemTete.montant_total)-vm.selectedItemcout_sousprojet_construction.cout;
                    vm.showbuttonNouvSousprojet = true;
                  }
              }
              else
              {
                
                cout_sousprojet_construction.id = String(data.response);
                NouvelItemcout_sousprojet_construction = false ;
                vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+cout_sousprojet_construction.cout;
                cout_sousprojet_construction.type_cout_sousprojet= type_mait[0];
                vm.showbuttonNouvSousprojet = false;
              }              
            cout_sousprojet_construction.$selected = false;
              cout_sousprojet_construction.$edit = false;
              vm.selectedItemcout_sousprojet_construction = {};
            })
            .error
            (
              function (data)
              {
                vm.showAlert("Error","Erreur lors de l'insertion de donnée");
              }
            );


        }

        vm.annulercout_sousprojet_construction = function(item)
        {
          if (NouvelItemcout_sousprojet_construction == false)
          {
            item.$edit = false;
            item.$selected = false;
            
            item.id_type_cout_sousprojet = currentItemcout_sousprojet_construction.type_cout_sousprojet.id ;
            item.cout = currentItemcout_sousprojet_construction.cout ;
          }
          else
          {
            vm.allcout_sousprojet_construction = vm.allcout_sousprojet_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemcout_sousprojet_construction.id;
            });
          }
          NouvelItemcout_sousprojet_construction      = false;
          vm.selectedItemcout_sousprojet_construction = {} ;

        }

        vm.selectcout_sousprojet_construction = function(item)
        {
          vm.selectedItemcout_sousprojet_construction = item ;
          console.log(vm.selectedItemcout_sousprojet_construction);
          if(item.$selected==false || item.$selected==undefined)
          {
              currentItemcout_sousprojet_construction     = JSON.parse(JSON.stringify(vm.selectedItemcout_sousprojet_construction));
          }
        }

        $scope.$watch('vm.selectedItemcout_sousprojet_construction', function()
        {
             if (!vm.allcout_sousprojet_construction) return;
             vm.allcout_sousprojet_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemcout_sousprojet_construction.$selected = true;
        });

        vm.changetype_cout_sousprojet = function(item)
        { 
            var typ_mai = vm.alltype_cout_sousprojet.filter(function(obj)
            {
                return obj.id == item.id_type_cout_sousprojet;
            });
            item.cout = parseInt(typ_mai[0].cout_sousprojet);
            
        };

/***********************************fin cout sousprojet**************************************/

      /*****************debut convention detail**************/

      //col table
        vm.convention_cife_detail_column1 = [
        {
          titre:"Intitule"
        },
        {
          titre:"Delai"
        },
        {
          titre:"Prévision bénéficiaire"
        },
        {
          titre:"Prévision nombre école"
        },
        {
          titre:"Date signature"
        },
        {
          titre:"Observation"
        }];

        vm.convention_cife_detail_column2 = [
        {
          titre:"Nom banque"
        },
        {
          titre:"Adresse banque"
        },
        {
          titre:"RIB"
        }];

        //Masque de saisi ajout
        vm.ajouterDetail = function ()
        { 
          if (NouvelItemDetail == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              intitule:'Construction d’un bâtiment à 2 salles de classe équipé de mobiliers scolaires et d’une latrine à 3 compartiments',
              prev_nbr_ecole:1,
              prev_beneficiaire:'',
              id_compte_feffi:'',
              adresse_banque:'',
              rib:'',
              delai:'',
              date_signature:'',
              observation:''
            };         
            vm.allconvention_cife_detail.push(items);
            vm.allconvention_cife_detail.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemDetail = conv;
              }
            });

            NouvelItemDetail = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDetail(convention_cife_detail,suppression)
        {
            if (NouvelItemDetail==false)
            {
                test_existanceDetail (convention_cife_detail,suppression); 
            } 
            else
            {
                insert_in_baseDetail(convention_cife_detail,suppression);
            }
        }

        //fonction de bouton d'annulation convention_cife_detail
        vm.annulerDetail = function(item)
        {
          if (NouvelItemDetail == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.intitule = currentItemDetail.intitule;
              item.prev_beneficiaire = currentItemDetail.prev_beneficiaire;
              item.prev_nbr_ecole = currentItemDetail.prev_nbr_ecole; 
 

              item.id_compte_feffi  = currentItemDetail.compte_feffi.id ;
              item.nom_banque  = currentItemDetail.compte_feffi.nom_banque ;
              item.adresse_banque  = currentItemDetail.compte_feffi.adresse_banque ;
              item.rib  = currentItemDetail.compte_feffi.rib ;
              item.delai = currentItemDetail.delai ;
              item.observation  = currentItemDetail.observation ;
              item.date_signature  = new Date(currentItemDetail.date_signature) ; 
          }else
          {
            vm.allconvention_cife_detail = vm.allconvention_cife_detail.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDetail.id;
            });
          }

          vm.selectedItemDetail = {} ;
          NouvelItemDetail      = false;
          
        };

        //fonction selection item detail convention cisco/feffi
        vm.selectionDetail = function (item)
        {
            vm.selectedItemDetail = item;

            if(item.$selected==false || item.$selected ==undefined)
            {
              currentItemDetail     = JSON.parse(JSON.stringify(vm.selectedItemDetail));
            }
            
           // vm.allconvention= [] ;             

        };
        $scope.$watch('vm.selectedItemDetail', function()
        {
             if (!vm.allconvention_cife_detail) return;
             vm.allconvention_cife_detail.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDetail.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierDetail = function(item)
        {
            NouvelItemDetail = false ;
            vm.selectedItemDetail = item;
            currentItemDetail = angular.copy(vm.selectedItemDetail);
            $scope.vm.allconvention_cife_detail.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.intitule = vm.selectedItemDetail.intitule ;
            item.prev_beneficiaire = parseInt(vm.selectedItemDetail.prev_beneficiaire) ;
            item.prev_nbr_ecole = parseInt(vm.selectedItemDetail.prev_nbr_ecole) ;

            item.id_compte_feffi  = vm.selectedItemDetail.compte_feffi.id ;
            item.nom_banque  = vm.selectedItemDetail.compte_feffi.nom_banque ;
            item.adresse_banque  = vm.selectedItemDetail.compte_feffi.adresse_banque ;
            item.rib  = vm.selectedItemDetail.compte_feffi.rib ;
            item.delai = parseInt(vm.selectedItemDetail.delai) ;
            item.observation  = vm.selectedItemDetail.observation ;
            item.date_signature  = new Date(vm.selectedItemDetail.date_signature)
        };

        //fonction bouton suppression item detail convention cisco feffi
        vm.supprimerDetail = function()
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
                vm.ajoutDetail(vm.selectedItemDetail,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceDetail (item,suppression)
        {          
            if (suppression!=1)
            {
               var convD = vm.allconvention_cife_detail.filter(function(obj)
                {
                   return obj.id == currentItemDetail.id;
                });
                if(convD[0])
                {
                   if((convD[0].intitule!=currentItemDetail.intitule)
                    || (convD[0].date_signature!=currentItemDetail.date_signature)
                    || (convD[0].prev_nbr_ecole!=currentItemDetail.prev_nbr_ecole)
                    || (convD[0].prev_beneficiaire!=currentItemDetail.prev_beneficiaire)
                    || (convD[0].id_compte_feffi!=currentItemDetail.id_compte_feffi)
                    || (convD[0].observation!=currentItemDetail.observation)
                    || (convD[0].delai!=currentItemDetail.delai))                    
                      {
                          insert_in_baseDetail(item,suppression);                        
                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDetail(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseDetail(convention_cife_detail,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDetail ==false)
            {
                getId = vm.selectedItemDetail.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    //montant_total:    convention_cife_detail.montant_total,
                    //avancement:    convention_cife_detail.avancement,
                    intitule:    convention_cife_detail.intitule,
                    prev_beneficiaire:    convention_cife_detail.prev_beneficiaire,
                    prev_nbr_ecole:    convention_cife_detail.prev_nbr_ecole, 
                    id_convention_entete: vm.selectedItemTete.id ,
                    delai:    convention_cife_detail.delai,
                    date_signature:    convertionDate(new Date(convention_cife_detail.date_signature)),
                    //id_compte_feffi: convention_cife_detail.id_compte_feffi,
                    observation: convention_cife_detail.observation,           
                });
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_detail/index",datas, config).success(function (data)
            {
                var comp_fef = vm.allcompte_feffi.filter(function(obj)
                {
                    return obj.id == convention_cife_detail.id_compte_feffi;
                });

                if (NouvelItemDetail == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                       /* vm.selectedItemDetail.intitule  = convention_cife_detail.intitule;
                        vm.selectedItemDetail.delai  = convention_cife_detail.delai;
                        vm.selectedItemDetail.date_signature    = convention_cife_detail.date_signature;*/
                        vm.selectedItemDetail.compte_feffi = comp_fef[0];
                       // vm.selectedItemDetail.observation = convention_cife_detail.observation;

                        vm.selectedItemDetail.$selected  = false;
                        vm.selectedItemDetail.$edit      = false;
                        vm.selectedItemDetail ={};
                        vm.showbuttonNouvDetail = false;
                    }
                    else 
                    {    
                      vm.allconvention_cife_detail = vm.allconvention_cife_detail.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDetail.id;
                      });
                      vm.showbuttonNouvDetail = true;
                    }
                }
                else
                {
                  
                 /* convention_cife_detail.intitule= convention_cife_detail.intitule;
                  convention_cife_detail.delai  = convention_cife_detail.delai;
                  convention_cife_detail.date_signature    = convention_cife_detail.date_signature;*/
                  convention_cife_detail.compte_feffi = comp_fef[0];
                  //convention_cife_detail.observation = convention_cife_detail.observation;
                  convention_cife_detail.id  =   String(data.response);              
                  NouvelItemDetail = false;

                  vm.showbuttonNouvDetail = false;
            }
              convention_cife_detail.$selected = false;
              convention_cife_detail.$edit = false;
              vm.selectedItemDetail = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


        vm.changecompte_feffi = function(item)
        {
          var comp_fef = vm.allcompte_feffi.filter(function(obj)
          {
             return obj.id == item.id_compte_feffi;
          });
          vm.selectedItemDetail.adresse_banque    = comp_fef[0].adresse_banque;
          vm.selectedItemDetail.rib       = comp_fef[0].rib;

        }
       
      /*****************fin convention detail****************/

      /*****************debut batiment construction***************/
      //col table

        vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"Nombre salle"
        },
        {
          titre:"Cout unitaire"
        },
        {
          titre:"Action"
        }];




        //Masque de saisi ajout
        vm.ajouterBatiment_construction = function ()
        { 
          if (NouvelItemBatiment_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_batiment:'',
              cout_unitaire:'',
              nbr_salle:''
            };         
            vm.allbatiment_construction.push(items);
            
              
            vm.selectedItemBatiment_construction = items;
            

            NouvelItemBatiment_construction = true ;
          }
          else
          {
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
          }                
                      
        };


        


        //fonction ajout dans bdd
        function ajoutBatiment_construction(batiment_construction,suppression)
        {
            if (NouvelItemBatiment_construction==false)
            {
                test_existanceBatiment_construction (batiment_construction,suppression); 
            } 
            else
            {
                insert_in_baseBatiment_construction(batiment_construction,suppression);
            }
        }

        //fonction de bouton d'annulation batiment_construction
        vm.annulerBatiment_construction = function(item)
        {
          if (NouvelItemBatiment_construction == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_type_batiment = currentItemBatiment_construction.id_type_batiment;
              item.cout_unitaire = currentItemBatiment_construction.cout_unitaire;
             item.nbr_salle = currentItemBatiment_construction.type_batiment.nbr_salle;
             // item.id_attachement_batiment    = currentItemBatiment_construction.id_attachement_batiment; 
          }else
          {
            vm.allbatiment_construction = vm.allbatiment_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemBatiment_construction.id;
            });
          }

          vm.selectedItemBatiment_construction = {} ;
          NouvelItemBatiment_construction      = false;
          
        };

        //fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;

            if(item.$selected==false || item.$selected ==undefined)
            {
               currentItemBatiment_construction     = JSON.parse(JSON.stringify(vm.selectedItemBatiment_construction));
            }
           // vm.allconvention= [] ;          
            //recuperation donnée convention
            /*if (vm.selectedItemBatiment_construction.id!=0)
            {
              vm.stepThree = true;
              vm.stepFor = false;
            } */          

        };
        $scope.$watch('vm.selectedItemBatiment_construction', function()
        {
             if (!vm.allbatiment_construction) return;
             vm.allbatiment_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBatiment_construction.$selected = true;
        });

        //fonction masque de saisie modification item batiment construction
        vm.modifierBatiment_construction = function(item)
        {
            NouvelItemBatiment_construction = false ;
            vm.selectedItemBatiment_construction = item;
            currentItemBatiment_construction = angular.copy(vm.selectedItemBatiment_construction);
            $scope.vm.allbatiment_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.id_type_batiment = vm.selectedItemBatiment_construction.type_batiment.id;
            item.cout_unitaire = parseInt(vm.selectedItemBatiment_construction.cout_unitaire);
            item.nbr_salle = parseInt(vm.selectedItemBatiment_construction.type_batiment.nbr_salle);

        };

        //fonction bouton suppression item batiment construction cisco feffi
        vm.supprimerBatiment_construction = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutBatiment_construction(vm.selectedItemBatiment_construction,1);
                vm.stepThree = false;
                vm.stepFor = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceBatiment_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var ouv_c = vm.allbatiment_construction.filter(function(obj)
                {
                   return obj.id == currentItemBatiment_construction.id;
                });
                if(ouv_c[0])
                {
                   if((ouv_c[0].id_type_batiment!=currentItemBatiment_construction.id_type_batiment)
                    || (ouv_c[0].cout_unitaire!=currentItemBatiment_construction.cout_unitaire)
                    )                    
                      { 
                        insert_in_baseBatiment_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseBatiment_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseBatiment_construction(batiment_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemBatiment_construction ==false)
            {
                getId = vm.selectedItemBatiment_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_type_batiment: batiment_construction.id_type_batiment,
                    cout_unitaire: batiment_construction.cout_unitaire,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("batiment_construction/index",datas, config).success(function (data)
            {

                var typ_bat = vm.alltype_batiment.filter(function(obj)
                {
                    return obj.id == batiment_construction.id_type_batiment;
                });

                if (NouvelItemBatiment_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemBatiment_construction.type_batiment = typ_bat[0];
                        vm.selectedItemBatiment_construction.$selected  = false;
                        vm.selectedItemBatiment_construction.$edit      = false;
                        vm.selectedItemBatiment_construction ={};
                        var cout_ancien_bat= parseInt(currentItemBatiment_construction.cout_unitaire);
                        var cout_nouveau_bat= parseInt(typ_bat[0].cout_batiment);
                        var cout_tot = parseInt(vm.selectedItemTete.montant_total)- cout_ancien_bat + cout_nouveau_bat ;

                        vm.selectedItemTete.montant_total= cout_tot;
                        vm.showbuttonNouvBatiment=false;
                        // miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                    else 
                    {    
                      vm.allbatiment_construction = vm.allbatiment_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemBatiment_construction.id;
                      });
                      vm.showbuttonNouvBatiment=true;
                      /*var prix_latrine=0;
                      var prix_mobilier=0;

                      if(vm.alllatrine_construction.length!=0)
                      { 
                          vm.alllatrine_construction.forEach(function(item)
                         {
                            prix_latrine = prix_latrine + (item.nbr_latrine*item.cout_unitaire)
                         });
                      }
                      if(vm.allmobilier_construction.length!=0)
                      { 
                          vm.allmobilier_construction.forEach(function(item)
                         {
                            prix_mobilier = prix_mobilier + (item.nbr_mobilier*item.cout_unitaire)
                         });
                      }*/
                      var cout_ancien_bat= parseInt(currentItemBatiment_construction.cout_unitaire);
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total) - cout_ancien_bat;
                      vm.selectedItemTete.montant_total = cout_tot;
                       //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                }
                else
                {
                  
                  batiment_construction.type_batiment= typ_bat[0];
                  /*batiment_construction.nbr_batiment = batiment_construction.nbr_batiment;
                  batiment_construction.cout_unitaire = batiment_construction.cout_unitaire;*/
                  batiment_construction.id  =   String(data.response);              
                  NouvelItemBatiment_construction = false;
                  
                  vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+ 
                  parseInt(batiment_construction.cout_unitaire);
                  vm.showbuttonNouvBatiment=false;
                 //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
            }
              batiment_construction.$selected = false;
              batiment_construction.$edit = false;
              vm.selectedItemBatiment_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        //fonction bouton modification ouvrage
        vm.modification_type_batiment = function(item)
        { 
            var bato = vm.alltype_batiment.filter(function(obj)
            {
                return obj.id == item.id_type_batiment;
            });
            item.cout_unitaire = parseInt(bato[0].cout_batiment);
            item.nbr_salle = parseInt(bato[0].nbr_salle);
            
        };


      /*****************fin batiment construction***************/


       /*****************debut latrine construction***************/
      //col table
        vm.latrine_construction_column1 = [        
        {
          titre:"Latrine"
        },
        {
          titre:"Nombre boxe latrine"
        },
        {
          titre:"Nombre point d'eau"
        },
        {
          titre:"cout latrine"
        },
        {
          titre:"Action"
        }];

        //Masque de saisi ajout
        vm.ajouterLatrine_construction = function ()
        { 
          if (NouvelItemLatrine_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_latrine:'',
              cout_unitaire:'',
              nbr_box_latrine:'',
              nbr_point_eau:''
            };         
            vm.alllatrine_construction.push(items);
            vm.alllatrine_construction.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemLatrine_construction = conv;
              }
            });

            NouvelItemLatrine_construction = true ;
          }else
          {
            vm.showAlert('Ajout entête latrine construction','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutLatrine_construction(latrine_construction,suppression)
        {
            if (NouvelItemLatrine_construction==false)
            {
                test_existanceLatrine_construction (latrine_construction,suppression); 
            } 
            else
            {
                insert_in_baseLatrine_construction(latrine_construction,suppression);
            }
        }

        //fonction de bouton d'annulation latrine_construction
        vm.annulerLatrine_construction = function(item)
        {
          if (NouvelItemLatrine_construction == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_type_latrine = currentItemLatrine_construction.id_type_latrine;
              item.cout_unitaire = currentItemLatrine_construction.cout_unitaire;
              item.nbr_box_latrine = currentItemLatrine_construction.nbr_box_latrine;
              item.nbr_point_eau = currentItemLatrine_construction.nbr_point_eau; 
          }else
          {
            vm.alllatrine_construction = vm.alllatrine_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemLatrine_construction.id;
            });
          }

          vm.selectedItemLatrine_construction = {} ;
          NouvelItemLatrine_construction      = false;
          
        };

        //fonction selection item Latrine construction cisco/feffi
        vm.selectionLatrine_construction = function (item)
        {
            vm.selectedItemLatrine_construction = item;

            if (item.$selected==false || item.$selected ==undefined)
            {
               currentItemLatrine_construction     = JSON.parse(JSON.stringify(vm.selectedItemLatrine_construction));
            }           

        };
        $scope.$watch('vm.selectedItemLatrine_construction', function()
        {
             if (!vm.alllatrine_construction) return;
             vm.alllatrine_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemLatrine_construction.$selected = true;
        });

        //fonction masque de saisie modification item Latrine construction
        vm.modifierLatrine_construction = function(item)
        {
            NouvelItemLatrine_construction = false ;
            vm.selectedItemLatrine_construction = item;
            currentItemLatrine_construction = angular.copy(vm.selectedItemLatrine_construction);
            $scope.vm.alllatrine_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            //recuperation donnée type_latrine
            /*apiFactory.getAPIgeneraliserREST("type_latrine/index","id_type_batiment",vm.selectedItemBatiment_construction.type_batiment.id).then(function(result)
            {
              vm.alltype_latrine= result.data.response;
              item.id_type_latrine = vm.selectedItemLatrine_construction.type_latrine.id;
            });*/
            item.id_type_latrine = vm.selectedItemLatrine_construction.type_latrine.id;
            //item.cout_latrine = parseInt(vm.selectedItemLatrine_construction.cout_latrine);
            item.cout_unitaire = parseInt(vm.selectedItemLatrine_construction.cout_unitaire);
            item.nbr_box_latrine = parseInt(vm.selectedItemLatrine_construction.type_latrine.nbr_box_latrine);
            item.nbr_point_eau = parseInt(vm.selectedItemLatrine_construction.type_latrine.nbr_point_eau);
            

            
        };

        //fonction bouton suppression item Latrine construction
        vm.supprimerLatrine_construction = function()
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
                vm.ajoutLatrine_construction(vm.selectedItemLatrine_construction,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceLatrine_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var latr_con = vm.alllatrine_construction.filter(function(obj)
                {
                   return obj.id == currentItemLatrine_construction.id;
                });
                if(latr_con[0])
                {
                   if((latr_con[0].id_type_latrine!=currentItemLatrine_construction.id_type_latrine)
                    || (latr_con[0].cout_unitaire!=currentItemLatrine_construction.cout_unitaire)
                    )                    
                      { 
                        insert_in_baseLatrine_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseLatrine_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseLatrine_construction(latrine_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemLatrine_construction ==false)
            {
                getId = vm.selectedItemLatrine_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_type_latrine: latrine_construction.id_type_latrine,
                    cout_unitaire: latrine_construction.cout_unitaire,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("latrine_construction/index",datas, config).success(function (data)
            {

                var typ_lat = vm.alltype_latrine.filter(function(obje)
                {
                    return obje.id == latrine_construction.id_type_latrine;
                });

                if (NouvelItemLatrine_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemLatrine_construction.type_latrine = typ_lat[0];
                        vm.selectedItemLatrine_construction.$selected  = false;
                        vm.selectedItemLatrine_construction.$edit      = false;
                        vm.selectedItemLatrine_construction ={};

                        var cout_ancien_lat= parseInt(currentItemLatrine_construction.cout_unitaire);
                        var cout_nouveau_lat= parseInt(typ_lat[0].cout_latrine);
                        var cout_tot = parseInt(vm.selectedItemTete.montant_total)- cout_ancien_lat + cout_nouveau_lat ;
                        vm.selectedItemTete.montant_total = cout_tot;
                        //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                        vm.showbuttonNouvLatrine=false;
                    }
                    else 
                    {    
                      vm.alllatrine_construction = vm.alllatrine_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemLatrine_construction.id;
                      });

                      var cout_ancien_lat= parseInt(currentItemLatrine_construction.cout_unitaire);
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total) - cout_ancien_lat;
                      vm.selectedItemTete.montant_total = cout_tot;
                       //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                       vm.showbuttonNouvLatrine=true;
                      
                    }
                }
                else
                {
                  
                  latrine_construction.type_latrine= typ_lat[0];
                  latrine_construction.id  =   String(data.response);              
                  NouvelItemLatrine_construction = false;
                  
                  vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+ 
                  parseInt(latrine_construction.cout_unitaire);
                  //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                  vm.showbuttonNouvLatrine=false;
            }
              latrine_construction.$selected = false;
              latrine_construction.$edit = false;
              vm.selectedItemLatrine_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //fonction bouton modification ouvrage
        vm.modification_type_latrine = function(item)
        {
            var annel = vm.alltype_latrine.filter(function(obj)
            {
                return obj.id == item.id_type_latrine;
            });
            //console.log(annel[0]);
            item.cout_unitaire = parseInt(annel[0].cout_latrine);
            item.nbr_box_latrine = parseInt(annel[0].nbr_box_latrine);
            item.nbr_point_eau = parseInt(annel[0].nbr_point_eau);
        };
      /*****************fin latrine construction***************/

      /*****************debut mobilier construction***************/
       //col table
        vm.mobilier_construction_column = [        
        {
          titre:"Mobilier"
        },
        {
          titre:"Nombre table banc"
        },
        {
          titre:"Nombre table maitre"
        },
        {
          titre:"Nombre chaise maitre"
        },
        {
          titre:"Cout mobilier"
        },
        {
          titre:"Action"
        }];

        //Masque de saisi ajout
        vm.ajouterMobilier_construction = function ()
        { 
          if (NouvelItemMobilier_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_mobilier:'',
              cout_unitaire:'',
              nbr_table_banc:'',
              nbr_table_maitre:'',
              nbr_chaise_maitre:'',
            };         
            vm.allmobilier_construction.push(items);
            vm.allmobilier_construction.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemMobilier_construction = conv;
              }
            });

            NouvelItemMobilier_construction = true ;
          }else
          {
            vm.showAlert('Ajout entête mobilier construction','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMobilier_construction(mobilier_construction,suppression)
        {
            if (NouvelItemMobilier_construction==false)
            {
                test_existanceMobilier_construction (mobilier_construction,suppression); 
            } 
            else
            {
                insert_in_baseMobilier_construction(mobilier_construction,suppression);
            }
        }

        //fonction de bouton d'annulation mobilier_construction
        vm.annulerMobilier_construction = function(item)
        {
          if (NouvelItemMobilier_construction == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_type_mobilier = currentItemMobilier_construction.id_type_mobilier;
              item.cout_unitaire = currentItemMobilier_construction.cout_unitaire;
              item.nbr_table_banc = currentItemMobilier_construction.nbr_table_banc;
              item.nbr_table_maitre = currentItemMobilier_construction.nbr_table_maitre;
              item.nbr_chaise_maitre = currentItemMobilier_construction.nbr_chaise_maitre; 
          }else
          {
            vm.allmobilier_construction = vm.allmobilier_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMobilier_construction.id;
            });
          }

          vm.selectedItemMobilier_construction = {} ;
          NouvelItemMobilier_construction      = false;
          
        };

        //fonction selection item Mobilier construction cisco/feffi
        vm.selectionMobilier_construction = function (item)
        {
            
            vm.selectedItemMobilier_construction = item;

            if(item.$selected == false || item.$selected ==undefined)
            {
               currentItemMobilier_construction     = JSON.parse(JSON.stringify(vm.selectedItemMobilier_construction));
            }
           
           // vm.allconvention= [] ;
        };
        $scope.$watch('vm.selectedItemMobilier_construction', function()
        {
             if (!vm.allmobilier_construction) return;
             vm.allmobilier_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMobilier_construction.$selected = true;
        });

        //fonction masque de saisie modification item Mobilier construction
        vm.modifierMobilier_construction = function(item)
        {
            NouvelItemMobilier_construction = false ;
            vm.selectedItemMobilier_construction = item;
            currentItemMobilier_construction = angular.copy(vm.selectedItemMobilier_construction);
            $scope.vm.allmobilier_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_type_mobilier = vm.selectedItemMobilier_construction.type_mobilier.id;
            item.cout_unitaire = parseInt(vm.selectedItemMobilier_construction.cout_unitaire);
            item.nbr_table_banc = parseInt(vm.selectedItemMobilier_construction.type_mobilier.nbr_table_banc);
            item.nbr_table_maitre = parseInt(vm.selectedItemMobilier_construction.type_mobilier.nbr_table_maitre);
            item.nbr_chaise_maitre = parseInt(vm.selectedItemMobilier_construction.type_mobilier.nbr_chaise_maitre);
            

            
        };

        //fonction bouton suppression item Latrine construction
        vm.supprimerMobilier_construction = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données mobiliers et latrines seront également supprimer')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutMobilier_construction(vm.selectedItemMobilier_construction,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceMobilier_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var latr_con = vm.allmobilier_construction.filter(function(obj)
                {
                   return obj.id == currentItemMobilier_construction.id;
                });
                if(latr_con[0])
                {
                   if((latr_con[0].id_type_mobilier!=currentItemMobilier_construction.id_type_mobilier)
                    || (latr_con[0].cout_unitaire!=currentItemMobilier_construction.cout_unitaire)
                    )                    
                      { 
                        insert_in_baseMobilier_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMobilier_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseMobilier_construction(mobilier_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMobilier_construction ==false)
            {
                getId = vm.selectedItemMobilier_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_type_mobilier: mobilier_construction.id_type_mobilier,
                    cout_unitaire: mobilier_construction.cout_unitaire,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("mobilier_construction/index",datas, config).success(function (data)
            {

                var typ_mob = vm.alltype_mobilier.filter(function(obje)
                {
                    return obje.id == mobilier_construction.id_type_mobilier;
                });

                if (NouvelItemMobilier_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemMobilier_construction.mobilier_ouvrage = typ_mob[0];
                        //vm.selectedItemMobilier_construction.nbr_mobilier = mobilier_construction.nbr_mobilier;
                        //vm.selectedItemMobilier_construction.cout_unitaire = mobilier_construction.cout_unitaire;
                        vm.selectedItemMobilier_construction.$selected  = false;
                        vm.selectedItemMobilier_construction.$edit      = false;
                        vm.selectedItemMobilier_construction ={};

                        var cout_ancien_mob= parseInt(currentItemMobilier_construction.cout_unitaire);
                        var cout_nouveau_mob= parseInt(typ_mob[0].cout_mobilier);
                        var cout_tot = parseInt(vm.selectedItemTete.montant_total)- cout_ancien_mob + cout_nouveau_mob ;
                        vm.selectedItemTete.montant_total = cout_tot;
                        vm.showbuttonNouvMobilier=false;
                    }
                    else 
                    {    
                      vm.allmobilier_construction = vm.allmobilier_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMobilier_construction.id;
                      });

                      var cout_ancien_mob= parseInt(currentItemMobilier_construction.cout_unitaire);
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total) - cout_ancien_mob;

                      vm.selectedItemTete.montant_total = cout_tot;
                      vm.showbuttonNouvMobilier=true;
                      
                      
                    }
                }
                else
                {
                  
                  mobilier_construction.type_mobilier= typ_mob[0];
                  //mobilier_construction.nbr_mobilier = mobilier_construction.nbr_mobilier;
                  //mobilier_construction.cout_unitaire = mobilier_construction.cout_unitaire;
                  mobilier_construction.id  =   String(data.response);              
                  NouvelItemMobilier_construction = false;
                  
                  //console.log(latrine_construction);
                  
                 // vm.selectedItemTete.montant_total = parseInt(vm.selectedItemDetail.montant_total)+parseInt(mobilier_construction.cout_unitaire);
                  vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+ 
                  parseInt(mobilier_construction.cout_unitaire);
                  vm.showbuttonNouvMobilier=false;
            }
              mobilier_construction.$selected = false;
              mobilier_construction.$edit = false;
              vm.selectedItemMobilier_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //fonction bouton modification ouvrage
        vm.modification_type_mobilier = function(item)
        {
            var annel = vm.alltype_mobilier.filter(function(obj)
            {
                return obj.id == item.id_type_mobilier;
            });
            item.cout_unitaire = parseInt(annel[0].cout_mobilier);
            item.nbr_table_banc = parseInt(annel[0].nbr_table_banc);
            item.nbr_table_maitre = parseInt(annel[0].nbr_table_maitre);
            item.nbr_chaise_maitre = parseInt(annel[0].nbr_chaise_maitre);
            
        };
      /*****************fin mobilier construction***************/

      

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
})();
