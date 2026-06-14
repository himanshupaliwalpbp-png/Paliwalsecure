import { NextRequest, NextResponse } from 'next/server';
import {
  policyGlossary,
  blogArticles,
  mythBusters,
  insuranceCompanies,
  diseaseSpecificPlans,
  marketComparisons,
  categoryInfo,
  healthInsurancePlans,
  lifeInsurancePlans,
  motorInsurancePlans,
  IRDAI_MANDATORY_DISCLAIMER,
} from '@/lib/insurance-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase();

  // If a specific section is requested
  if (section) {
    switch (section) {
      case 'glossary': {
        let data = policyGlossary;
        if (category) data = data.filter(g => g.category === category);
        if (query) data = data.filter(g =>
          g.term.toLowerCase().includes(query) ||
          g.explanation.toLowerCase().includes(query) ||
          (g.hindiTerm && g.hindiTerm.includes(query))
        );
        return NextResponse.json({ success: true, section: 'glossary', count: data.length, data });
      }
      case 'articles': {
        let data = blogArticles;
        if (category) data = data.filter(a => a.category.toLowerCase() === category.toLowerCase());
        if (query) data = data.filter(a =>
          a.title.toLowerCase().includes(query) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(query)) ||
          (a.summary && a.summary.toLowerCase().includes(query))
        );
        return NextResponse.json({ success: true, section: 'articles', count: data.length, data });
      }
      case 'myths': {
        let data = mythBusters;
        if (category) data = data.filter(m => m.category === category);
        return NextResponse.json({ success: true, section: 'myths', count: data.length, data });
      }
      case 'companies': {
        let data = insuranceCompanies;
        if (category) data = data.filter(c => c.category === category);
        return NextResponse.json({ success: true, section: 'companies', count: data.length, data });
      }
      case 'disease-plans': {
        let data = diseaseSpecificPlans;
        if (query) data = data.filter(d => d.disease.toLowerCase().includes(query));
        return NextResponse.json({ success: true, section: 'disease-plans', count: data.length, data });
      }
      case 'comparisons': {
        let data = marketComparisons;
        if (category) data = data.filter(c => c.category === category);
        return NextResponse.json({ success: true, section: 'comparisons', count: data.length, data });
      }
      case 'plans': {
        let data = [...healthInsurancePlans, ...lifeInsurancePlans, ...motorInsurancePlans];
        if (category) data = data.filter(p => p.category === category);
        return NextResponse.json({ success: true, section: 'plans', count: data.length, data });
      }
      case 'categories': {
        return NextResponse.json({ success: true, section: 'categories', data: categoryInfo });
      }
      default:
        return NextResponse.json({ success: false, error: 'Invalid section. Available: glossary, articles, myths, companies, disease-plans, comparisons, plans, categories' }, { status: 400 });
    }
  }

  // If no section specified, return knowledge base summary
  return NextResponse.json({
    success: true,
    knowledgeBase: {
      glossary: { count: policyGlossary.length, categories: [...new Set(policyGlossary.map(g => g.category))] },
      articles: { count: blogArticles.length, categories: [...new Set(blogArticles.map(a => a.category))] },
      myths: { count: mythBusters.length, categories: [...new Set(mythBusters.filter(m => m.category).map(m => m.category!))] },
      companies: { count: insuranceCompanies.length, categories: [...new Set(insuranceCompanies.map(c => c.category))] },
      diseasePlans: { count: diseaseSpecificPlans.length },
      comparisons: { count: marketComparisons.length },
      plans: { count: healthInsurancePlans.length + lifeInsurancePlans.length + motorInsurancePlans.length },
    },
    disclaimer: IRDAI_MANDATORY_DISCLAIMER,
    usage: 'Add ?section=glossary|articles|myths|companies|disease-plans|comparisons|plans|categories&category=health|life|motor&q=search',
  });
}
