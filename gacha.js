/*-----------------------------
    Gacha Pull code
    By: Illujin
Description: Simulates a ten and single pull using predetermined rates. Character and summon pools are located in array.
Specific character rate ups are hard coded.
Call either Gacha(10) or Gacha(1) for the appropriate pulls.

-------------------------------*/

module.exports = {
Gacha: function(type){
    
    // Gacha Rates
      var SSRRate = 3;
      var SSRCharRate = 0.018;
      var SRCharRate = 0.043; 
      var SRCharlessRate = 0.166;
      var RCharRate = 0.210;
      var RCharlessRate = 0.692;
      var SSRSumRate = 0.015;
      var SRSumRate = 0.357;
      var RSumRate = 1.041;
    
    // For rate ups on specific characters/summons
    
      var SSRCharRateUp = 0.7;
      var SRCharRateUp = 1.5;
      var SSRSumRateUp = 0;
      var SRSumRateUp = 0;
    
    // Gacha Pool
    
      var SSRCharPool = ['Percival', 'Aoidos', 'Magisa', 'Zeta (Fire)', 'Yuel', 'Metera (Fire)', 'Societte (Fire)', 'Heles', 'Anthuria', 'Agielba', 'Ghandagoza', 'Aliza', 'Zahlhamelina', 'Grea', 'Vane', 'Romeo', 'Altair', 'Lancelot', 'Yngwie', 'Chat Noir', 'Silva', 'Anne', 'Societte (Water)', 'Izmir', 'Yodarha', 'Charlotta', 'Lilele', 'Lady Katapillar & Vira', 'Lily', 'Aletheia', 'Siegfried', 'Ayer', 'Sara', 'De La Fille (Earth)', 'Eustace', 'Melleau', 'Catherine', 'Nemone', 'Hallessena', 'Razia', 'Arulumaya', 'Yggdrasil', 'Gawain', 'Nezahualpilli', 'Petra', 'Feena', 'Lennah', 'Arriet', 'Metera', 'Korwa', 'Yuisis', 'Scathacha', 'Carmelina', 'Melissabelle', 'Dorothy & Claudia', 'Albert', 'Rosamia', 'De La Fille (Light)', 'Sophia', 'Jeanne d\'arc (Light)', 'Juliet', 'Sarunan (Light)', 'Seruel', 'Ferry', 'Baotorda', 'Amira', 'Vira', 'Lady Grey', 'Zeta (Dark)', 'Jeanne d\'arc (Dark)', 'Beatrix', 'Sarunan (Dark)', 'Vaseraga', 'Narmaya', 'Forte', 'Marquiares', 'Veight', 'Vania', 'Cerberus', 'Cagliostro (Earth)', 'Cagliostoro (Dark)', 'Clarisse (Fire)', 'Clarisse (Light)'];
      var SRCharPool = ['Ryan', 'Dante', 'Alec', 'Lucius (Fire)', 'Anna', 'Mary', 'Therese', 'Teena', 'Carren',  'Cucuroux', 'Elmott', 'Blazing Teacher Elmott', 'Sutera (Fire)', 'Sen', 'Vane', 'Owen', 'Ange', 'Sig', 'Ejaeli', 'Pengy', 'Mina', 'Mishra', 'Lamretta (Water)', 'Ulamnuran', 'Milleore', 'Sahli Lao', 'Erin', 'Soriz', 'Jamil (Earth)', 'Herja', 'Farrah', 'Jasmine', 'Gayne', 'Jessica', 'Mariah', 'Galadar', 'Redluck', 'Lamretta (Earth)', 'Yaia', 'Laguna', 'Almeida', 'Ladiva', 'Eso', 'Hazen', 'Elta', 'Tyre', 'Helnar', 'Keehar', 'Sevastien', 'Sutera (Wind)', 'Sevilbarra', 'Mimlemel', 'Mimlemel & Stumpeye', 'Goblin Mage', 'Feather', 'Johann', 'J.J.', 'Rosamia', 'Jeanne d\'Arc', 'Ferry', 'Arusha', 'Baotorda', 'Daetta', 'Sarya', 'Vermeil', 'Noa', 'Deliford', 'Will', 'Lucius (Dark)', 'Jamil (Dark)', 'Tanya', 'Vira', 'Predator', 'Shao', 'Zaja', 'Danua', 'Ludmila', 'Dorothy', 'Claudia', 'Ezecrain', 'Deliford'];
      var RCharPool = ['Ryan', 'Ippatsu', 'Dante', 'Viceroy', 'Anna', 'Mary', 'Rosine', 'Flesselles', 'Barawa', 'Camieux (Fire)', 'Karva', 'Lamretta', 'Elmelaura', 'Drusilla', 'Deliford', 'Richard', 'Joel', 'Randall', 'Cailana', 'Yodarha', 'Alistair', 'Suframare', 'Bridgette','Herja', 'Farrah', 'Volenna', 'Jasmine', 'Nene', 'La Coiffe', 'Galadar', 'Garma', 'Vanzza', 'Camieux (Earth)', 'Norcel', 'Balurga', 'Eso', 'Hazen', 'Petra', 'Stan', 'Krugne', 'Thelonim', 'Karteira', 'Chloe', 'Pavidus', 'Leonora', 'Feather', 'Rosamia', 'Cordella', 'Daetta', 'Vermeil', 'Philosophia', 'Will', 'Zehek', 'Tanya', 'Lowain', 'Bakura', 'Lunalu'];
      var SSRSumPool = ['Athena', 'Satyr', 'Twin Elements', 'Agni', 'Prometheus', 'Sethlans', 'Shiva', 'Zaoshen', 'Macula Marius', 'Grani', 'Oceanus', 'Neptune', 'Varuna', 'Kaguya', 'Ca Ong', 'Bonito', 'Europa', 'Baal', 'Cybele', 'Medusa', 'Titan', 'Gilgamesh', 'Tezcatlipoca', 'Godsworn Alexiel', 'Ankusha', 'Quetzacoatl', 'Siren', 'Nehza', 'Garuda', 'Zephyrus', 'Rose Queen', 'Morrigna', 'Setehk', 'Garula', 'Vortex Dragon', 'Apollo', 'Odin', 'Lucifer', 'Grand Order', 'Zeus', 'Hector', 'Thor', 'Aphrodite', 'Satan', 'Bahamut', 'Dark Angel Olivia', 'Lich', 'Hades', 'Anubis', 'Typhon', 'Nacht'];
      var SRSumPool = ['Garnet Carbuncle', 'Aquamarine Carbuncle', 'Zircon Carbuncle', 'Opal Carbuncle', 'Onyx Carbuncle'];
    
    // Rate Up Pool
    
      var SSRCharRateUpPool = ['Azazel'];
      var SRCharRateUpPool = ['Vania'];
      var SSRSumRateUpPool = ['RateUpSum'];
      var SRSumRateUpPool = ['RateUpSum'];
    
    //Rates
      
      var SSRCharTotal = SSRCharPool.length;
      var SSRCharTotalRate = SSRCharTotal*SSRCharRate/SSRRate*100;
      var SSRSumTotal = SSRSumPool.length;
      var SSRSumTotalRate = SSRSumTotal*SSRSumRate/SSRRate*100;
      var SSRCharRateUpTotal = SSRCharRateUpPool.length;
      var SSRCharRateUpTotalRate = SSRCharRateUpTotal*SSRCharRateUp/SSRRate*100;
      var SSRSumRateUpTotal = SSRSumRateUpPool.length;
      var SSRSumRateUpTotalRate = SSRSumRateUpTotal*SSRSumRateUp/SSRRate*100;
      
      var SRCharTotal = SRCharPool.length;
      var SRCharTotalRate = SRCharTotal*SRCharRate/0.15;
      var SRCharlessTotal = 36;
      var SRCharlessTotalRate = SRCharlessTotal*SRCharlessRate/0.15;
      var SRTrashSumTotal = 16;
      var SRSumTotal = SRSumPool.length+SRTrashSumTotal;
      var SRSumTotalRate = SRSumTotal*SRSumRate/0.15;
      var SRCharRateUpTotal = SRCharRateUpPool.length;
      var SRCharRateUpTotalRate = SRCharRateUpTotal*SRCharRateUp/0.15;
      var SRSumRateUpTotal = SRSumRateUpPool.length;
      var SRSumRateUpTotalRate = SRSumRateUpTotal*SRSumRateUp/0.15;
      
      var RCharTotal = RCharPool.length;
      var RCharTotalRate = RCharTotal*RCharRate/(85-SSRRate)*100;
      var RCharlessTotal = 65;
      var RCharlessTotalRate = RCharlessTotal*RCharlessRate/(85-SSRRate)*100;
      var RSumTotal = 25;  
      var RSumTotalRate = RSumTotal*RSumRate/(85-SSRRate)*100;
      
      function drawRarity(SSRRate){
        var RNG = Math.floor(Math.random()*100+1);
        var rarity;
        if(RNG <= SSRRate){
          rarity = 'SSR';
        }
        if(RNG > SSRRate && RNG <= SSRRate+15){
        rarity = 'SR'; 
        }
        if(RNG > SSRRate+15){
          rarity = 'R';
        }
        return rarity;
      }
    
      function guaranteedTenth(SSRRate){
        var RNG = Math.floor(Math.random()*100+1);
        var rarity;
        if(RNG <= SSRRate){
          rarity = 'SSR';
        }
        else{
        rarity = 'SR';
        }
        return rarity;
      }
    
      function pickSSRType(CharRate,SumRate,RateUpChar,RateUpSum){
        var RNG = Math.random()*(CharRate+SumRate+RateUpChar+RateUpSum);
        var result;
        if(RNG<=CharRate){
         result = 'Character';
        }
        if(RNG > CharRate && RNG <= CharRate+SumRate){
         result = 'Summon';
        }
        if(RNG > CharRate+SumRate && RNG <= CharRate+SumRate+RateUpChar && RateUpChar > 0){
          result = 'Rate Up Character';
        }
        if(RNG > CharRate+SumRate+RateUpChar && RateUpSum > 0){
         result = 'Rate Up Summon';
        }
        return result;
      }
    
      function pickSRType(CharRate,CharlessRate,SumRate,RateUpChar,RateUpSum){
        var RNG = Math.random()*(CharRate+CharlessRate+SumRate+RateUpChar+RateUpSum);
        var result;
        if(RNG<=CharRate){
         result = 'Character';
        }
        if(RNG > CharRate && RNG <= CharRate+CharlessRate){
          result = 'Weapon';
        }
        if(RNG > CharRate+CharlessRate && RNG <= CharRate+CharlessRate+SumRate){
          result = 'Summon';
        }
        if(RNG > CharRate+CharlessRate+SumRate && RNG <= CharRate+CharlessRate+SumRate+RateUpChar && RateUpChar > 0){
         result = 'Rate Up Character';
        }
        if(RNG > CharRate+CharlessRate+SumRate+RateUpChar && RNG <= CharRate+CharlessRate+SumRate+RateUpChar+RateUpSum && RateUpSum > 0){
         result = 'Rate Up Summon';
        }
        return result;
      }
    
      function pickRType(CharRate,CharlessRate,SumRate){
        var RNG = Math.random()*(CharRate+CharlessRate+SumRate);
        var result;
        if(RNG<=CharRate){
          result = 'Character';
        }
        if(RNG > CharRate && RNG <= CharRate+CharlessRate){
          result = 'Weapon';
        }
        if(RNG > CharRate+CharlessRate){
          result = 'Summon';
        }
        return result;
      }
    
      function nonTrashResult(Pool){
        var total = Pool.length;
        var RNG = Math.floor(Math.random()*total);
        return Pool[RNG];
      } 
      
      var singleDrawResult;
      
    //Single Roll
      
      if(type === 1){
        singleDrawResult = drawRarity(SSRRate);
        if(singleDrawResult === "SSR"){
          singleDrawResult = pickSSRType(SSRCharTotalRate,SSRSumTotalRate,SSRCharRateUpTotalRate,SSRSumRateUpTotalRate);
          if(singleDrawResult === "Character"){
            singleDrawResult = nonTrashResult(SSRCharPool);
            return "Congratulations! You drew " + singleDrawResult + " (SSR)!";
          }
          if(singleDrawResult === "Summon"){
            singleDrawResult = nonTrashResult(SSRSumPool);
            return "Congratulations! You drew " + singleDrawResult + " (SSR)!";
          }
          if(singleDrawResult === "Rate Up Character"){
            singleDrawResult = nonTrashResult(SSRCharRateUpPool);
            return "Congratulations! You drew " + singleDrawResult + " (SSR)!";
          }
          if(singleDrawResult === "Rate Up Summon"){
            singleDrawResult = nonTrashResult(SSRSumRateUpPool);
            return "Congratulations! You drew " + singleDrawResult + " (SSR)!";
          }
        }
          if(singleDrawResult === "SR"){
            singleDrawResult = pickSRType(SRCharTotalRate,SRCharlessTotalRate,SRSumTotalRate,SRCharRateUpTotalRate,SRSumRateUpTotalRate);
            if(singleDrawResult === "Character"){
              singleDrawResult = nonTrashResult(SRCharPool);
              return "Congratulations! You drew " + singleDrawResult + " (SR)!";
            }
            if(singleDrawResult === "Weapon"){
              return "Sorry, looks like you got a crappy SR weapon.";
            }
            if(singleDrawResult === "Summon"){
              var randomSRSummon;
              randomSRSummon = Math.floor(Math.random()*(SRSumTotal)+1);
              if(randomSRSummon<7){
                singleDrawResult = nonTrashResult(SRSumPool);
                return "Congratulations! You drew a " + singleDrawResult + " (SR)!";
              }
              else{
                return "Sorry, looks like you got a crappy SR summon.";
              }
            }
            if(singleDrawResult === "Rate Up Character"){
              singleDrawResult = nonTrashResult(SRCharRateUpPool);
              return "Congratulations! You drew " + singleDrawResult + " (SR)!";
            }
            if(singleDrawResult === "Rate Up Summon"){
              singleDrawResult = nonTrashResult(SRSumRateUpPool);
              return "Congratulations? You drew " + singleDrawResult + " (SR)...";
            }
          }
        if(singleDrawResult === "R"){
          singleDrawResult = pickRType(RCharTotalRate,RCharlessTotalRate,RSumTotalRate);
          if(singleDrawResult === "Character"){
            singleDrawResult = nonTrashResult(RCharPool);
            return "Congratulations! You drew " + singleDrawResult + " (R)!";
          }
          if(singleDrawResult === "Weapon"){
            return "Sorry, you drew R weapon fodder.";
          }
          if(singleDrawResult === "Summon"){
            return "Sorry, you drew a worthless R summon.";
          }
        }
      }
      
    //Ten Roll
      
      if(type === 10){
        var SSR = 0;
        var SR = 0;
        var R = 0;
        var SSRResults = "None";
        var SRGoodResults = "None";
        var SRWeaponNum = 0;
        var SRTrashNum = 0;
        var RCharResults = "None";
        var RWeaponNum = 0;
        var RTrashNum = 0;
        var Rarity;
        for(i=1;i<=10;i++){
          if(R < 9){
            Rarity = drawRarity(SSRRate);
          }
          if(R === 9){
            Rarity = guaranteedTenth(SSRRate);
          }
          if(Rarity === "SSR"){
            SSR++;
            singleDrawResult = pickSSRType(SSRCharTotalRate,SSRSumTotalRate,SSRCharRateUpTotalRate,SSRSumRateUpTotalRate);
            if(singleDrawResult === "Character"){
              singleDrawResult = nonTrashResult(SSRCharPool);
            }
            if(singleDrawResult === "Summon"){
              singleDrawResult = nonTrashResult(SSRSumPool);
            }
            if(singleDrawResult === "Rate Up Character"){
              singleDrawResult = nonTrashResult(SSRCharRateUpPool);
            }
            if(singleDrawResult === "Rate Up Summon"){
              singleDrawResult = nonTrashResult(SSRCharRateUpPool);
            }
            if(SSRResults === "None"){
              SSRResults = "(" + singleDrawResult + ",";
            }
            else{
              SSRResults = SSRResults + " " + singleDrawResult + ",";
            }
          }
          if(Rarity === "SR"){
            SR++;
            singleDrawResult = pickSRType(SRCharTotalRate,SRCharlessTotalRate,SRSumTotalRate,SRCharRateUpTotalRate,SRSumRateUpTotalRate);
            if(singleDrawResult === "Character"){
              singleDrawResult = nonTrashResult(SRCharPool);
              if(SRGoodResults === "None"){
                SRGoodResults = "(" + singleDrawResult + ",";
              }
              else{
                SRGoodResults = SRGoodResults + " " + singleDrawResult + ",";
              }
            }
            if(singleDrawResult === "Weapon"){
              SRWeaponNum++;
            }
            if(singleDrawResult === "Summon"){
              var randSRSummon;
              randSRSummon = Math.floor(Math.random()*(SRSumTotal)+1);
              if(randSRSummon<7){
                singleDrawResult = nonTrashResult(SRSumPool);
                if(SRGoodResults === "None"){
                  SRGoodResults = "(" + singleDrawResult + ",";
                }
                else{
                  SRGoodResults = SRGoodResults + " " + singleDrawResult + ",";
                }
              }
              else{
                SRTrashNum++;
              }
            }
            if(singleDrawResult === "Rate Up Character"){
              singleDrawResult = nonTrashResult(SRCharRateUpPool);
                if(SRGoodResults === "None"){
                  SRGoodResults = "(" + singleDrawResult + ",";
                }
                else{
                  SRGoodResults = SRGoodResults + " " + singleDrawResult + ",";
                }
            }
            if(singleDrawResult === "Rate Up Summon"){
              singleDrawResult = nonTrashResult(SRSumRateUpPool);
              if(SRGoodResults === "None"){
                SRGoodResults = "(" + singleDrawResult + ",";
              }
              else{
                SRGoodResults = SRGoodResults + " " + singleDrawResult + ",";
              }
            }
          }
          if(Rarity === "R"){
            R++;
            singleDrawResult = pickRType(RCharTotalRate,RCharlessTotalRate,RSumTotalRate);
            if(singleDrawResult === "Character"){
              singleDrawResult = nonTrashResult(RCharPool);
              if(RCharResults === "None"){
                RCharResults = "(" + singleDrawResult + ",";
              }
              else{
                RCharResults = RCharResults + " " + singleDrawResult + ",";
              }
            }
            if(singleDrawResult === "Weapon"){
              RWeaponNum++;
            }
            if(singleDrawResult === "Summon"){
              RTrashNum++;
            }
          }
        }
        var SSRString;
        var SRString;
        var RString;
        var EndResult;
        
        if(SSR>0){
          SSRString = SSRResults;
          SSRString = SSRString.substring(0,SSRString.length-1);
          SSRString += ")";
        }
        
        if(SRGoodResults !== "None"){
          SRString = SRGoodResults;
          if(SRWeaponNum > 0){
            SRString = SRString + " " + SRWeaponNum + " weapon fodder,";
          }
          if(SRTrashNum > 0){
            SRString = SRString + " " + SRTrashNum + " trash summons)";
          }
        }
        if(SRGoodResults === "None"){
          if(SRWeaponNum > 0){
            SRString = "(" + SRWeaponNum + " weapon fodder,";
            if(SRTrashNum > 0){
              SRString = SRString + " " + SRTrashNum + " trash summons)";
            }
          }
          else{
            SRString = "(" + SRTrashNum + " trash summons)";
          }
        }
        SRString = SRString.substring(0,SRString.length-1);
        SRString = SRString + ")";
        
        if(RCharResults !== "None"){
          RString = RCharResults;
            if(RWeaponNum > 0){
              RString = RString + " " + RWeaponNum + " weapon fodder,";
            }
            if(RTrashNum > 0){
            RString = RString + " " + RTrashNum + " trash summons)";
            }
        }
        if(RCharResults === "None"){
          if(RWeaponNum > 0){
            RString = "(" + RWeaponNum + " weapon fodder,";
            if(RTrashNum > 0){
              RString = RString + " " + RTrashNum + " trash summons)";
            }
          }
          else{
            RString = "(" + RTrashNum + " trash summons)";
          }
        }
        RString = RString.substring(0,RString.length-1);
        RString = RString + ")";
        
        
        if(SSR>0){
          EndResult = "You drew " + SSR + " SSR " + SSRString + ", " + SR + " SR " + SRString + ", and " + R + " R " + RString + "!"; 
          if(SR === 0){
            EndResult = "You drew " + SSR + " SSR " + SSRString + " and " + R + " R " + RString + "!";
            return EndResult;
          }
          return EndResult;
        }
        else{
          EndResult = "You drew " + SR + " SR " + SRString + " and " + R + " R " + RString + "!";
          return EndResult;
        }
      }
    }
}